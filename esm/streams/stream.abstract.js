import EventEmitter from 'component-emitter';

/**
 * @typedef {import('./streams.types.js').AutoRetry} AutoRetry
 */

const BACKOFF_FACTOR = 1.25;
const INIT_RETRY_TIMEOUT = 1500;
const MAX_RETRY_COUNT = Infinity;
const PING_TIMEOUT_FACTOR = 1.25;

export const AUTHENTICATION_REASON = {
  type: 'close',
  wasClean: true,
  reason: 'Authentication failure',
  code: 4001,
};

export const FORCE_CLOSE_REASON = {
  type: 'close',
  wasClean: true,
  reason: 'Close forced by client',
  code: 4002,
};

export const ERROR_REASON = {
  type: 'close',
  wasClean: true,
  reason: 'Close because of error',
  code: 4003,
};

export class AuthenticationError extends Error {}

export class PingError extends Error {}

/**
 * Base class for connecting to stream APIs (WebSocket, SSE, ...).
 * Handles :
 * * ping mechanism
 * * auto retry
 *
 * @abstract
 */
export class AbstractStream extends EventEmitter {
  constructor() {
    super();
    /** @type {AutoRetry|null} */
    this._autoRetry = null;
  }

  // -- public methods ------

  /**
   * Opens the source stream with this._openSource() it can be SSE, WS...
   * If `options.autoRetry` is enabled, source stream is automatically closed and reopened if no ping is received within the expected timeframe or any unknown error
   *
   * @param {Object} options
   * @param {Boolean} [options.autoRetry] - Enables auto retry behaviour (network resilient stream)
   * @param {Number} [options.backoffFactor=BACKOFF_FACTOR] - Factor used to compute exponential backoff delays
   * @param {Number} [options.initRetryTimeout=INIT_RETRY_TIMEOUT] - First iteration timeout, also used to compute exponential backoff delays
   * @param {Number} [options.pingTimeoutFactor=PING_TIMEOUT_FACTOR] - Factor used to wait a bit longer than the ping delay promised by the API
   * @param {Number} [options.maxRetryCount=MAX_RETRY_COUNT] - Maximum number of consecutive iterations the auto retry behaviour can do
   */
  open(options = {}) {
    const { autoRetry = false } = options;

    // Make sure the source is closed before opening it
    this._closeSource();

    if (autoRetry) {
      this._autoRetry = {
        counter: 0,
        backoffFactor: options.backoffFactor || BACKOFF_FACTOR,
        initRetryTimeout: options.initRetryTimeout || INIT_RETRY_TIMEOUT,
        pingTimeoutFactor: options.pingTimeoutFactor || PING_TIMEOUT_FACTOR,
        maxRetryCount: options.maxRetryCount || MAX_RETRY_COUNT,
      };
    }

    this.emit('open');
    this._openSource().catch((error) => this._onError(error));
  }

  close(reason = FORCE_CLOSE_REASON) {
    // Close source stream
    this._closeSource();
    // Always clear all timeouts
    clearTimeout(this._pingTimeoutId);
    clearTimeout(this._autoRetry.timeoutId);
    this.emit('close', reason);
  }

  // -- abstract methods ------

  /**
   * @returns {Promise<void>}
   * @abstract
   * @protected
   */
  async _openSource() {
    // It's up to the class extending AbstractStream to implement how to open a source of data (SSE, WebSocket...)
    throw new Error('Not implemented');
  }

  /**
   * @returns {void}
   * @abstract
   * @protected
   */
  _closeSource() {
    // It's up to the class extending AbstractStream to implement how to close a source of data (SSE, WebSocket...)
    throw new Error('Not implemented');
  }

  // -- protected methods ------

  /**
   * @param {number} delay in milliseconds
   * @protected
   */
  _onPing(delay) {
    this.emit('ping', delay);
    if (this._autoRetry != null) {
      // Receiving a ping means the stream works fine and we can reset the auto retry counter
      this._autoRetry.counter = 0;
    }
    clearTimeout(this._pingTimeoutId);
    this._pingTimeoutId = setTimeout(() => {
      this._onError(new PingError('Stream failed to send ping within timeframe'));
    }, delay * PING_TIMEOUT_FACTOR);
  }

  /**
   * @param {any} error
   * @protected
   */
  _onError(error) {
    if (error instanceof AuthenticationError) {
      this.close(AUTHENTICATION_REASON);
      this.emit('error', error);
      return;
    }

    // any other kind of error => we force close
    this.close({ ...ERROR_REASON, reason: error.message });

    if (this._autoRetry == null) {
      this.emit('error', error);
    } else {
      this._autoRetry.counter += 1;

      if (this._autoRetry.counter > this._autoRetry.maxRetryCount) {
        return this.emit('error', new Error(`Stream connection failed ${this._autoRetry.maxRetryCount} times!`));
      }

      const exponentialBackoffDelay =
        this._autoRetry.initRetryTimeout * this._autoRetry.backoffFactor ** this._autoRetry.counter;
      this._autoRetry.timeoutId = setTimeout(() => {
        this.emit('open');
        this._openSource().catch((error) => this._onError(error));
      }, exponentialBackoffDelay);
    }
  }

  /**
   * @param {any} data
   * @returns {boolean}
   * @protected
   */
  _isPingMessage(data) {
    // Our ping/pong system is common to all our implementations
    return data != null && data.type === 'heartbeat' && data.heartbeat_msg === 'ping';
  }
}
