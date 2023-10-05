import { EVENT_STREAM_CONTENT_TYPE, fetchEventSource, JSON_CONTENT_TYPE } from './sse-fetch-event-source.js';
import { addOauthHeader } from '../oauth.js';
import { CustomEventTarget } from './custom-event-target.js';

const SSE_HEARTBEAT_PERIOD_MS = 2 * 1000;
const SAFE_SSE_HEARTBEAT_PERIOD = SSE_HEARTBEAT_PERIOD_MS * 2;

/**
 * CleverCloud specificities over an SSE
 * handle retry on: healthcheck timeout, non 200
 */
export default class CleverCloudSse extends CustomEventTarget {
  constructor (apiHost, tokens) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.abortController = new AbortController();
    this.lastId = null;
    this.lastContact = null;
    this.healthCheckerIntervalId = null;
    this.paused = false;
    this.eventCount = 0;
  }

  /**
   * build an URL from a base path and advanced query params
   * @param {*} path
   * @param {*} queryParams
   * @returns {URL}
   */
  buildUrl (path = '', queryParams = {}) {
    const url = new URL(path, this.apiHost);

    Object.entries(queryParams)
      .map(([param, values]) => {
        if (Array.isArray(values)) {
          return [param, values];
        }

        return [param, [values]];
      })
      .map(([param, values]) => values.forEach(value => {
        if (value==null) {
          return;
        }

        url.searchParams.append(param, formatValue(value));
      }));

    console.log(url.toString());
    return url.toString();
  }

  /**
   * manually close the stream
   * @param {any} reason
   */
  close (reason) {
    clearTimeout(this.healthCheckerIntervalId);
    this.abortController.abort(reason);
  }

  /**
   * ABSTRACT compute full URL with query params
   * @returns {string}
   */
  getUrl () {
    throw new Error('please implement getUrl() method');
  }

  /**
   * start the stream
   * @returns {Promise<any>}
   */
  async start () {
    if (this.abortController.signal.aborted) {
      return Promise.reject(new Error('cannot start, controller has been aborted'));
    }

    let requestParams = { method: 'get', url: this.getUrl() };
    if (this.tokens != null) {
      requestParams = await addOauthHeader(this.tokens)(requestParams);
    }

    // if there is no message since x, then reset the sse
    this.healthCheckerIntervalId = setInterval(() => {
      this.performHealthCheck();
    }, 1000);

    return fetchEventSource(requestParams.url, {
      headers: requestParams.headers,
      abortController: this.abortController,
      resumeFrom: this.lastId,
      onOpen: (res) => this._onOpen(res),
      onMessage: (msg) => this._onMessage(msg),
      onClose: (reason) => this._onClose(reason),
      onError: (err) => this._onError(err),
    });
  }

  performHealthCheck () {
    if (this.lastContact == null) {
      return;
    }

    const now = new Date();
    const diff = now.getTime() - this.lastContact.getTime();
    if (diff > SAFE_SSE_HEARTBEAT_PERIOD) {
      this.emit('error', { error: new Error(`no healthcheck since ${diff}, restarting...`) });
      this.pause();
      this.resume();
    }
  }

  pause () {
    this.paused = true;
    clearTimeout(this.healthCheckerIntervalId);
    this.abortController.abort('pause');
    this.lastContact = null;
  }

  resume () {
    this.abortController = new AbortController();
    this.start();
  }

  /**
   * when SSE is opened
   * @param {Response} response
   */
  async _onOpen (response) {
    const contentType = response.headers.get('content-type');

    if (!contentType?.startsWith(EVENT_STREAM_CONTENT_TYPE)) {
      if (contentType === JSON_CONTENT_TYPE) {
        const content = await response.json();
        const { fieldName, fieldValue } = content.context.OVDErrorFieldContext || {};
        throw new Error(`${content.error} ${fieldValue || ''}`);
      }

      throw new Error(`bad content type for an SSE: ${contentType}`);
    }

    if (response.status !== 200) {
      throw new Error(`Unexpected status code '${response.status} ${response.statusText}' - ${response.headers.get('sozu-id')}`);
    }

    // don't emit 'opened' event if we resume
    if (!this.paused) {
      this.emit('opened', { response });
    }

    this.paused = false;
  }

  /**
   * transform a message before an event is emitted
   * @param {object} msg
   * @returns {object}
   */
  transform (msg) {
    return msg;
  }

  /**
   * when a message is received through SSE
   * @param {EventSourceMessage} msg
   */
  _onMessage = (msg) => {
    if (msg.id) {
      this.lastId = msg.id;
    }
    this.lastContact = new Date();

    switch (msg.event) {
      case 'HEARTBEAT':
        return;
      case 'END_OF_STREAM':
        this.endOfStreamReason = JSON.parse(msg.data).endedBy;
        // the server will soon close the connection
        return;
      default:
        this.eventCount++;
        const data = this.transform(JSON.parse(msg.data));
        this.emit(msg.event, { data });
        return;
    }
  };

  /**
   * when the SSE is closed
   * if a limiting parameter is reached, it's stored by the msg loop
   * but there is no reason given by the server in term of SSE
   * so we can give the reason sent in last EOS message
   * @param {*} reason
   */
  _onClose (reason) {
    // don't emit 'close' event if we just pause
    if (this.paused) {
      return;
    }
    this.emit('close', { reason: reason || this.abortController.signal.reason || this.endOfStreamReason });
  }

  /**
   * when the SSE has an error
   * @param {any} err
   */
  _onError (error) {
    this.emit('error', { error });
  }
}

/**
 * format a single query param
 * @param {any} value
 * @returns {string}
 */
function formatValue (value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value.toString();
}
