import EventEmitter from 'component-emitter';

import type { AutoRetry } from './streams.types.js';

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
export abstract class AbstractStream extends EventEmitter {
  protected _autoRetry: AutoRetry | null = null;
  protected _pingTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    this._autoRetry = null;
  }

  // -- public methods ------

  /**
   * Opens the source stream with this._openSource() it can be SSE, WS...
   * If `options.autoRetry` is enabled, source stream is automatically closed and reopened if no ping is received within the expected timeframe or any unknown error
   *
   * @param options.autoRetry - Enables auto retry behaviour (network resilient stream)
   * @param options.backoffFactor - Factor used to compute exponential backoff delays
   * @param options.initRetryTimeout - First iteration timeout, also used to compute exponential backoff delays
   * @param options.pingTimeoutFactor - Factor used to wait a bit longer than the ping delay promised by the API
   * @param options.maxRetryCount - Maximum number of consecutive iterations the auto retry behaviour can do
   */
  open(
    options: {
      autoRetry?: boolean;
      backoffFactor?: number;
      initRetryTimeout?: number;
      pingTimeoutFactor?: number;
      maxRetryCount?: number;
    } = {},
  ) {
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

  close(reason: any = FORCE_CLOSE_REASON) {
    // Close source stream
    this._closeSource();
    // Always clear all timeouts
    clearTimeout(this._pingTimeoutId);
    clearTimeout(this._autoRetry.timeoutId);
    this.emit('close', reason);
  }

  // -- abstract methods ------

  protected abstract _openSource(): Promise<void>;

  protected abstract _closeSource(): void;

  // -- protected methods ------

  /**
   * @param delay in milliseconds
   */
  protected _onPing(delay: number) {
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

  protected _onError(error: any) {
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

  protected _isPingMessage(data: any): boolean {
    // Our ping/pong system is common to all our implementations
    return data != null && data.type === 'heartbeat' && data.heartbeat_msg === 'ping';
  }
}
