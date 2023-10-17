import { EVENT_STREAM_CONTENT_TYPE, fetchEventSource, JSON_CONTENT_TYPE } from './sse-fetch-event-source.js';
import { addOauthHeader } from '../oauth.js';
import { CustomEventTarget } from './custom-event-target.js';
import { Retryable } from '../utils/retryable.js';

const SSE_HEARTBEAT_PERIOD_MS = 2 * 1000;
const SAFE_SSE_HEARTBEAT_PERIOD = SSE_HEARTBEAT_PERIOD_MS * 2;
const HEALTHCHECK_INTERVAL_MS = 1000;

/**
 * CleverCloud specificities over an SSE
 * handle retry on: healthcheck timeout, non 200
 * @fires CleverCloudSse#error
 * @fires CleverCloudSse#open
 * @fires CleverCloudSse#data
 */
export default class CleverCloudSse extends CustomEventTarget {
  /**
   * @param {string} apiHost
   * @param {object} tokens
   * @param {string} tokens.OAUTH_CONSUMER_KEY
   * @param {string} tokens.OAUTH_CONSUMER_SECRET
   * @param {string} tokens.API_OAUTH_TOKEN
   * @param {string} tokens.API_OAUTH_TOKEN_SECRET
   * @param {object} retryConfiguration
   * @param {boolean} retryConfiguration.enabled
   * @param {number} retryConfiguration.backoffFactor
   * @param {number} retryConfiguration.initRetryTimeout
   * @param {number} retryConfiguration.maxRetryCount
   */
  constructor (apiHost, tokens, retryConfiguration) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.retryable = new Retryable(retryConfiguration);
    this.lastId = null;
    this.lastContact = null;
    this.healthCheckerIntervalId = null;
    this.promise = null;
    this.paused = false;
    this.eventCount = 0;
    this._setupAbortController();
  }

  _setupAbortController () {
    this.abortController = new AbortController();
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
      .map(([param, values]) => {
        return values.forEach((value) => {
          if (value == null) {
            return;
          }

          url.searchParams.append(param, formatValue(value));
        });
      });

    return url.toString();
  }

  /**
   * manually close the stream
   * @param {any} reason
   */
  close (reason) {
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
   * cannot reject (use onError() for that)
   * @returns {}
   */
  async start () {
    if (this.promise == null) {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });

      this._start();
    }

    return this.promise;
  }

  async _start () {
    try {
      if (this.abortController.signal.aborted) {
        throw new Error('cannot start, controller has been aborted');
      }

      let requestParams = { method: 'get', url: this.getUrl() };
      if (this.tokens != null) {
        requestParams = await addOauthHeader(this.tokens)(requestParams);
      }

      this.healthCheckerIntervalId = setInterval(() => {
        this.performHealthCheck();
      }, HEALTHCHECK_INTERVAL_MS);

      fetchEventSource(requestParams.url, {
        headers: requestParams.headers,
        abortController: this.abortController,
        resumeFrom: this.lastId,
        onOpen: (res) => this._onOpen(res),
        onMessage: (msg) => this._onMessage(msg),
        onClose: (reason) => this._onClose(reason),
        onError: (err) => this._onError(err),
      });
    }
    catch (error) {
      this.reject(error);
    }
  }

  performHealthCheck () {
    if (this.lastContact == null) {
      return;
    }

    const now = new Date();
    const diff = now.getTime() - this.lastContact.getTime();
    if (diff > SAFE_SSE_HEARTBEAT_PERIOD) {
      /**
       * @event CleverCloudSse#error
       * @type {Event}
       * @property {Error} error
       */
      this.emit('error', { error: new Error(`no healthcheck since ${diff}, restarting...`) });
      this.pause();
      this.resume();
    }
  }

  pause () {
    this.paused = true;
    this.abortController.abort('pause');
    this.lastContact = null;
  }

  resume () {
    this._setupAbortController();
    this._start();
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

        if (response.status === 401) {
          throw new AuthenticationError(content.error);
        }

        const { fieldValue } = content.context.OVDErrorFieldContext || {};
        throw new Error(`${content.error} ${fieldValue || ''}`);
      }

      throw new Error(`bad content type for an SSE: ${contentType}`);
    }

    this.emit('open', { response });
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
  _onMessage (msg) {
    if (msg.id) {
      this.lastId = msg.id;
    }
    this.lastContact = new Date();
    this.retryable.reset();

    switch (msg.event) {
      case 'HEARTBEAT':
        return;
      case 'END_OF_STREAM':
        this.endOfStreamReason = JSON.parse(msg.data).endedBy;
        // the server will soon close the connection
        return;
      default: {
        this.eventCount++;
        const data = this.transform(JSON.parse(msg.data));
        /**
         * @event CleverCloudSse#data
         * @type {Event}
         * @property {object} data
         */
        this.emit(msg.event, { data });
      }
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
    clearInterval(this.healthCheckerIntervalId);
    // don't close if we just paused
    if (this.paused) {
      return;
    }

    this.resolve({ reason: reason || this.abortController.signal.reason || this.endOfStreamReason });
  }

  /**
   * when the SSE has an error
   * @param {any} err
   */
  _onError (error) {
    clearInterval(this.healthCheckerIntervalId);

    if (error instanceof AuthenticationError) {
      // unrecoverable error
      this.reject(error);
      return;
    }

    this.retryable.waitNextRetry()
      .then(() => {
        // emit a retryable error
        this.emit('error', { error });
        this._start();
      })
      .catch((err) => {
        this.reject(err + ': ' + error);
      });
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

export class AuthenticationError extends Error {
};
