import { addOauthHeader } from '../oauth.js';
import { extractQueryParamsFormUrl, fillUrlSearchParams } from '../utils/query-params.js';
import { CustomEventTarget } from './custom-event-target.js';
import { EVENT_STREAM_CONTENT_TYPE, fetchEventSource, JSON_CONTENT_TYPE } from './sse-fetch-event-source.js';

/**
 * @typedef {import('./streams.types.js').RetryConfiguration} RetryConfiguration
 * @typedef {import('./streams.types.js').SseCloseReason} SseCloseReason
 * @typedef {import('./streams.types.js').SseMessage} SseMessage
 * @typedef {import('../oauth.types.js').OAuthTokens} OAuthTokens
 * @typedef {import('../utils/query-params.types.js').QueryParams} QueryParams
 * @typedef {import('../request.types.js').RequestParams} RequestParams
 */

/**
 * @type {RetryConfiguration}
 */
const DEFAULT_RETRY_CONFIGURATION = {
  enabled: false,
  backoffFactor: 1.25,
  initRetryTimeout: 1000,
  maxRetryCount: Infinity,
};
const SSE_HEARTBEAT_PERIOD_MS = 2 * 1000;
const SAFE_SSE_HEARTBEAT_PERIOD = SSE_HEARTBEAT_PERIOD_MS * 2;
const HEALTHCHECK_INTERVAL_MS = 1000;
const CONNECTION_TIMEOUT_MS = 5000;

const NETWORK_ERROR_CODES = [
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'UND_ERR_SOCKET',
];

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
   * @param {OAuthTokens} tokens
   * @param {RetryConfiguration} [retryConfiguration]
   * @param {number} [connectionTimeout]
   */
  constructor(apiHost, tokens, retryConfiguration = {}, connectionTimeout) {
    super();
    this._apiHost = apiHost;
    this._tokens = tokens;
    this._promise = null;
    this._lastId = null;
    this._lastContact = null;
    this._connectionTimeoutId = null;
    this._heartbeatIntervalId = null;
    this._retry = { ...DEFAULT_RETRY_CONFIGURATION, ...retryConfiguration };
    this._retryTimeoutId = null;
    this.retryCount = 0;
    this._connectionTimeout = connectionTimeout ?? CONNECTION_TIMEOUT_MS;
    this.state = 'init';
  }

  /**
   * Build a URL from a base path and advanced query params
   *
   * @param {string} path
   * @param {import('../utils/query-params.types.js').QueryParams<string|Date|number>} queryParams
   * @returns {URL}
   */
  buildUrl(path = '', queryParams = {}) {
    const url = new URL(path, this._apiHost);

    fillUrlSearchParams(url, queryParams, formatValue);

    return url;
  }

  /**
   * ABSTRACT compute full URL with query params
   * @returns {URL}
   */
  getUrl() {
    throw new Error('please implement getUrl() method');
  }

  /**
   * start the stream
   * cannot reject (use onError() for that)
   * @returns {Promise<SseCloseReason>}
   */
  async start() {
    if (this._promise == null) {
      this._promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
      this._start();
    }

    return this._promise;
  }

  async _start() {
    try {
      const url = this.getUrl();

      /** @type {QueryParams} */
      const queryParams = extractQueryParamsFormUrl(url);

      /** @type {RequestParams} */
      let requestParams = {
        method: 'get',
        url: url.origin + url.pathname,
        queryParams,
      };
      if (this._tokens != null) {
        requestParams = await addOauthHeader(this._tokens)(requestParams);
      }

      this.state = 'connecting';
      this._abortController = new AbortController();

      this._connectionTimeoutId = setTimeout(() => {
        this._onError(new NetworkError('Connection timeout...'));
      }, this._connectionTimeout);

      fetchEventSource(url.toString(), {
        headers: requestParams.headers,
        abortController: this._abortController,
        resumeFrom: this._lastId,
        onOpen: (res) => this._onOpen(res),
        onMessage: (msg) => this._onMessage(msg),
        onClose: () => this._onClose(),
        onError: (err) => this._onError(err),
      });
    } catch (error) {
      this._onError(new NetworkError('Server closed the response without a END_OF_STREAM event', error));
    }
  }

  pause() {
    this.state = 'paused';
    this._cleanup();
  }

  resume() {
    this._start();
  }

  /**
   * manually close the stream
   * @param {SseCloseReason} [reason]
   */
  close(reason = { type: 'UNKNOWN' }) {
    if (this.state === 'closed') {
      return;
    }
    this.state = 'closed';
    this._cleanup();
    this._resolve(reason);
  }

  /**
   * @param {any} error
   * @returns {boolean}
   */
  _canRetry(error) {
    if (!this._retry.enabled) {
      return false;
    }

    if (this.retryCount >= this._retry.maxRetryCount) {
      return false;
    }

    const isErrorRetryable =
      error == null ||
      error instanceof ServerError ||
      error instanceof NetworkError ||
      (error instanceof HttpError && error.status >= 500);

    return isErrorRetryable;
  }

  _cleanup() {
    clearTimeout(this._retryTimeoutId);
    clearTimeout(this._connectionTimeoutId);
    clearInterval(this._heartbeatIntervalId);
    this._abortController?.abort();
  }

  /**
   * when SSE is opened
   * @param {Response} response
   */
  async _onOpen(response) {
    clearTimeout(this._connectionTimeoutId);

    const contentType = response.headers.get('content-type');

    if (response.status !== 200) {
      if (contentType === JSON_CONTENT_TYPE) {
        const errorBody = await response.json();
        const details = errorBody.context?.OVDErrorFieldContext?.fieldValue || '';
        throw new HttpError(response.status, `${errorBody.error} ${details}`);
      } else {
        const errorBody = await response.text();
        throw new HttpError(response.status, errorBody || 'Unknown error');
      }
    }

    if (!contentType?.startsWith(EVENT_STREAM_CONTENT_TYPE)) {
      throw new ServerError(`Invalid content type for an SSE: ${contentType}`);
    }

    /**
     * @event CleverCloudSse#open
     * @type {Event}
     * @property {{response: Response}} data
     */
    this.emit('open', { response });
    this.state = 'open';
    this._lastContact = new Date();
    this.retryCount = 0;

    this._heartbeatIntervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this._lastContact.getTime();
      if (diff > SAFE_SSE_HEARTBEAT_PERIOD) {
        this._onError(new NetworkError(`Failed to receive heartbeat within ${SAFE_SSE_HEARTBEAT_PERIOD}ms period`));
      }
    }, HEALTHCHECK_INTERVAL_MS);
  }

  /**
   * Transform a message before an event is emitted
   *
   * @param {string} _event
   * @param {any} data
   * @returns {any}
   */
  transform(_event, data) {
    return data;
  }

  /**
   * when a message is received through SSE
   *
   * @param {SseMessage} msg
   */
  _onMessage(msg) {
    this._lastContact = new Date();

    switch (msg.event) {
      case 'HEARTBEAT':
        return;
      case 'END_OF_STREAM': {
        try {
          const reason = JSON.parse(msg.data);
          this.close({ type: reason.endedBy });
        } catch (e) {
          this._onError(new ServerError(`Expect JSON for END_OF_STREAM event but got "${msg.data}"`, { cause: e }));
        }
        return;
      }
      default: {
        if (msg.id != null && msg.id.length > 0) {
          this._lastId = msg.id;
        }
        try {
          const data = this.transform(msg.event, msg.data);
          /**
           * @event CleverCloudSse#data
           * @type {Event}
           * @property {{data: any}} data
           */
          this.emit(msg.event, { data });
        } catch (e) {
          this._onError(new ServerError(`Cannot transform ${msg.event} event`, { cause: e }));
        }
      }
    }
  }

  /**
   * when the SSE is closed
   * if a limiting parameter is reached, it's stored by the msg loop
   * but there is no reason given by the server in term of SSE
   * so we can give the reason sent in last EOS message
   */
  _onClose() {
    if (this.state === 'closed' || this.state === 'paused') {
      return;
    }
    this._onError(new ServerError('Server closed the response without a END_OF_STREAM event'));
  }

  /**
   * when the SSE has an error
   * @param {any} error
   */
  _onError(error) {
    if (this.state === 'closed' || this.state === 'paused') {
      return;
    }

    this._cleanup();

    const wrappedError = isNetworkError(error)
      ? new NetworkError('Failed to establish/maintain the connection with the server', error)
      : error;

    if (this._canRetry(wrappedError)) {
      this.state = 'paused';
      /**
       * @event CleverCloudSse#error
       * @type {Event}
       * @property {{error: any}} data
       */
      this.emit('error', { error: wrappedError });

      this.retryCount++;
      const exponentialBackoffDelay = this._retry.initRetryTimeout * this._retry.backoffFactor ** this.retryCount;

      this._retryTimeoutId = setTimeout(() => {
        this._start();
      }, exponentialBackoffDelay);
    } else {
      this.state = 'closed';
      this._reject(wrappedError);
    }
  }
}

/**
 * format a single query param
 * @param {any} value
 * @returns {string}
 */
function formatValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value.toString();
}

/**
 * @param {{name: string, message: string, cause?: {code?: string}, code?: string}} error
 * @returns {boolean}
 */
function isNetworkError(error) {
  const errorCode = error?.cause?.code ?? error.code;
  if (NETWORK_ERROR_CODES.includes(errorCode)) {
    return true;
  }

  if (error.name === 'TypeError') {
    if (error.message === 'Failed to fetch') {
      return true;
    }
    if (error.message.startsWith('NetworkError')) {
      return true;
    }
  }

  return false;
}

export class NetworkError extends Error {
  /**
   * @param {string} message
   * @param {any} [cause]
   */
  constructor(message, cause) {
    super(message);
    this.cause = cause;
  }
}

export class HttpError extends Error {
  /**
   * @param {number} status
   * @param {string} details
   */
  constructor(status, details) {
    super(`HTTP error ${status}: ${details}`);
    this.status = status;
  }
}

export class ServerError extends Error {
  /**
   * @param {string} message
   * @param {any} [cause]
   */
  constructor(message, cause) {
    super(message);
    this.cause = cause;
  }
}
