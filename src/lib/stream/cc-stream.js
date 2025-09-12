/**
 * @import { CcStreamRequestFactory, CcStreamConfig, CcStreamState, CcStreamCloseReason } from './cc-stream.types.js'
 * @import { SseMessage } from './sse.types.js'
 */

import { CcClientError, CcHttpError } from '../error/cc-client-errors.js';
import { handleHttpErrors } from '../error/handle-http-errors.js';
import { HeadersBuilder } from '../request/headers-builder.js';
import { isNetworkError, sendRequest, SseResponseBody } from '../request/request.js';
import { combineWithSignal, Deferred } from '../utils.js';

const LAST_EVENT_ID_HEADER = 'Last-Event-ID';

/**
 * CcStream manages Server-Sent Events (SSE) connections with automatic retry logic,
 * heartbeat monitoring, and event handling. It provides a robust streaming solution
 * for real-time data from the Clever Cloud API.
 */
export class CcStream {
  /** @type {CcStreamRequestFactory} */
  #requestFactory;
  /** @type {CcStreamConfig} config */
  #config;
  /** @type {CcStreamState} */
  #state = 'init';
  /** @type {EventTarget} */
  #eventTarget = new EventTarget();
  /** @type {AbortController | null} */
  #abortController;
  /** @type {Deferred<CcStreamCloseReason>} */
  #closeDeferred;
  /** @type {string | null} */
  #lastReceivedMessageId;
  /** @type {Date | null} */
  #lastContact;
  /** @type {number} */
  #retryCount = 0;
  /** @type { any | null} */
  #retryTimeoutId = null;
  /** @type { any | null} */
  #heartbeatIntervalId = null;
  /** @type {Date | null} */
  #connectionStartTime = null;
  /** @type {Set<{type: string, callback: EventListenerOrEventListenerObject}>} */
  #eventListeners = new Set();

  /**
   * Creates a new CcStream instance.
   *
   * @param {CcStreamRequestFactory} requestFactory - Factory function that creates HTTP requests for the stream
   * @param {CcStreamConfig} config - Configuration options for the stream including retry settings and heartbeat
   */
  constructor(requestFactory, config) {
    this.#requestFactory = requestFactory;
    this.#config = config;
  }

  // -- public methods ---

  /**
   * Gets the current state of the stream.
   *
   * @returns {CcStreamState} The current stream state ('init', 'connecting', 'open', 'paused', or 'closed')
   */
  get state() {
    return this.#state;
  }

  /**
   * Gets the current retry count for connection attempts.
   *
   * @returns {number} The number of retry attempts made
   */
  get retryCount() {
    return this.#retryCount;
  }

  /**
   * Starts the stream. Returns a promise that
   * - resolves when the stream is closed,
   * - rejects when a non-retryable error occurs or when the retry limit is reached.
   * @returns {Promise<CcStreamCloseReason>}
   */
  start() {
    if (this.state !== 'init') {
      throw new CcClientError('Cannot start a stream that is not in the "init" state', 'SSE_INVALID_STATE_ERROR');
    }

    if (this.#closeDeferred == null) {
      this.#closeDeferred = new Deferred();
      this.#start();
    }

    return this.#closeDeferred.promise;
  }

  /**
   * Pauses the stream, stopping the current connection and preventing automatic retries.
   * The stream can be resumed later with the resume() method.
   */
  pause() {
    if (this.state !== 'open') {
      throw new CcClientError('Cannot pause a stream that is not in the "open" state', 'SSE_INVALID_STATE_ERROR');
    }

    this.#debugLog('Pausing stream', { previousState: this.#state });
    this.#state = 'paused';
    this.#cleanup();
  }

  /**
   * Resumes a paused stream, attempting to reconnect and continue streaming.
   */
  resume() {
    if (this.state !== 'paused') {
      throw new CcClientError('Cannot resume a stream that is not in the "paused" state', 'SSE_INVALID_STATE_ERROR');
    }

    this.#debugLog('Resuming stream', { previousState: this.#state });
    this.#start();
  }

  /**
   * Manually closes the stream with an optional reason.
   * Once closed, the stream cannot be reopened.
   *
   * @param {CcStreamCloseReason} [reason] - The reason for closing the stream
   */
  close(reason = { type: 'UNKNOWN' }) {
    if (this.state === 'closed') {
      return;
    }
    this.#debugLog('Manually closing stream', { reason, previousState: this.#state });
    this.#state = 'closed';
    this.#cleanup(true);
    this.#closeDeferred.resolve(reason);
  }

  /**
   * Registers a callback to be called when the stream opens successfully.
   *
   * @param {() => void} callback - Function to call when the stream opens
   * @return {this} This stream instance for method chaining
   */
  onOpen(callback) {
    return this.on('open', () => callback());
  }

  /**
   * Registers a callback to be called when the stream encounters an error.
   *
   * @param {(error: Error) => void} callback - Function to call when an error occurs
   * @return {this} This stream instance for method chaining
   */
  onError(callback) {
    return this.on('error', (event) => callback(event.data));
  }

  /**
   * Registers an event listener for the specified event type.
   * This is the generic event listener method used by other on* methods.
   *
   * @param {string} type - The event type to listen for
   * @param {(event: CcStreamEvent<T>) => void} callback - Function to call when the event occurs
   * @param {AddEventListenerOptions | boolean} [options] - Event listener options
   * @return {this} This stream instance for method chaining
   *
   * @template T Type of the event data
   */
  on(type, callback, options) {
    // @ts-ignore
    this.#eventTarget.addEventListener(type, callback, options);
    // @ts-ignore
    this.#eventListeners.add({ type, callback });
    return this;
  }

  // -- private methods ---

  /**
   * Logs debug information if debug mode is enabled
   * @param {string} message - The debug message
   * @param {any} [data] - Optional data to include in the log
   */
  #debugLog(message, data) {
    if (this.#config.debug) {
      const timestamp = new Date().toISOString();
      const logMessage = `[CcStream] [${timestamp}] ${message}`;
      if (data !== undefined) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  async #start() {
    this.#connectionStartTime = new Date();
    if (this.#config.retry) {
      this.#debugLog(
        `Starting stream connection (attempt ${this.#retryCount + 1}/${this.#config.retry.maxRetryCount + 1})`,
      );
    } else {
      this.#debugLog(`Starting stream connection`);
    }

    try {
      this.#debugLog(`Forging HTTP request`);
      const request = await this.#requestFactory();

      this.#state = 'connecting';
      this.#debugLog('State changed to connecting', { state: this.#state, retryCount: this.#retryCount });

      this.#abortController = new AbortController();
      combineWithSignal(this.#abortController, request.signal);

      const headersBuilder = new HeadersBuilder(request.headers).acceptEventStream();
      if (this.#lastReceivedMessageId != null) {
        headersBuilder.withHeader(LAST_EVENT_ID_HEADER, this.#lastReceivedMessageId);
        this.#debugLog('Resuming from last event ID', { lastEventId: this.#lastReceivedMessageId });
      }

      const response = await sendRequest({
        ...request,
        cache: null,
        headers: headersBuilder.build(),
        signal: this.#abortController.signal,
      });

      this.#debugLog('HTTP response received', {
        status: response.status,
        contentType: response.headers.get('content-type'),
      });

      handleHttpErrors(request, response);

      if (!(response.body instanceof SseResponseBody)) {
        this.#debugLog('Invalid response body type', { bodyType: typeof response.body });
        this.#onError(
          new CcClientError('Invalid response content type for an SSE', 'SSE_INVALID_CONTENT_TYPE', response),
        );
      }

      this.#onOpen();

      await response.body.read({
        onMessage: this.#onMessage.bind(this),
        onClose: this.#onClose.bind(this),
        onError: this.#onError.bind(this),
      });
    } catch (error) {
      if (error instanceof CcClientError) {
        this.#onError(error);
      } else {
        this.#onError(
          new CcClientError('Server closed the response without a END_OF_STREAM event', 'SSE_SERVER_ERROR', error),
        );
      }
    }
  }

  /**
   * Clears any active timeouts and intervals to prevent memory leaks.
   * @param {boolean} clearListeners - Whether to also clear event listeners
   */
  #cleanup(clearListeners = false) {
    this.#debugLog('Cleaning up stream resources');
    clearTimeout(this.#retryTimeoutId);
    clearInterval(this.#heartbeatIntervalId);
    if (clearListeners) {
      this.#eventListeners.forEach(({ type, callback }) => this.#eventTarget.removeEventListener(type, callback));
      this.#eventListeners.clear();
    }
    this.#abortController?.abort();
  }

  /**
   * When SSE is opened
   */
  async #onOpen() {
    const connectionTime = this.#connectionStartTime
      ? new Date().getTime() - this.#connectionStartTime.getTime()
      : null;
    this.#debugLog('Stream opened successfully', {
      connectionTimeMs: connectionTime,
      retryCount: this.#retryCount,
    });

    this.#emit('open');
    this.#state = 'open';
    this.#lastContact = new Date();
    this.#retryCount = 0;

    this.#heartbeatIntervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this.#lastContact.getTime();
      if (diff > this.#config.heartbeatPeriod) {
        this.#debugLog('Heartbeat timeout detected', {
          timeSinceLastContact: diff,
          heartbeatPeriod: this.#config.heartbeatPeriod,
        });
        this.#onError(
          new CcClientError(
            `Failed to receive heartbeat within ${this.#config.heartbeatPeriod}ms period`,
            'SSE_HEALTH_ERROR',
          ),
        );
      }
    }, this.#config.healthcheckInterval);
  }

  /**
   * when a message is received through SSE
   *
   * @param {SseMessage} message
   */
  #onMessage(message) {
    this.#lastContact = new Date();

    this.#debugLog('SSE message received', {
      event: message.event,
      id: message.id,
      dataLength: message.data ? message.data.length : 0,
      timestamp: this.#lastContact.toISOString(),
    });

    switch (message.event) {
      case 'HEARTBEAT':
        this.#debugLog('Heartbeat received');
        return;
      case 'END_OF_STREAM': {
        try {
          const reason = JSON.parse(message.data);
          this.#debugLog('End of stream received', { reason });
          this.close({ type: reason.endedBy });
        } catch (e) {
          this.#debugLog('Failed to parse END_OF_STREAM data', { data: message.data, error: e.message });
          this.#onError(
            new CcClientError(`Expect JSON for END_OF_STREAM event but got "${message.data}"`, 'SSE_SERVER_ERROR', e),
          );
        }
        return;
      }
      default: {
        if (message.id?.length > 0) {
          this.#lastReceivedMessageId = message.id;
        }

        this.#debugLog('Emitting custom event', { event: message.event, hasData: !!message.data });
        this.#emit(message.event, message.data);
      }
    }
  }

  #onClose() {
    if (this.#state === 'closed' || this.#state === 'paused') {
      this.#debugLog('Close event ignored', { currentState: this.#state });
      return;
    }
    this.#debugLog('Stream closed unexpectedly by server', {
      state: this.#state,
      lastMessageId: this.#lastReceivedMessageId,
      retryCount: this.#retryCount,
    });
    this.#onError(new CcClientError('Server closed the response without a END_OF_STREAM event', 'SSE_SERVER_ERROR'));
  }

  /**
   * when the SSE has an error
   * @param {CcClientError} error
   */
  #onError(error) {
    if (this.#state === 'closed' || this.#state === 'paused') {
      this.#debugLog('Error event ignored', { currentState: this.#state, error });
      return;
    }

    this.#debugLog('Stream error occurred', error);

    this.#cleanup();

    const wrappedError = isNetworkError(error)
      ? new CcClientError('Failed to establish/maintain the connection with the server', 'SSE_SERVER_ERROR', error)
      : error;

    const canRetry = this.#canRetry(wrappedError);
    this.#debugLog('Retry decision', {
      canRetry,
      retryCount: this.#retryCount,
      maxRetry: this.#config.retry?.maxRetryCount,
    });

    if (canRetry) {
      this.#state = 'paused';
      this.#emit('error', wrappedError);

      this.#retryCount++;
      const exponentialBackoffDelay =
        this.#config.retry.initRetryTimeout * this.#config.retry.backoffFactor ** this.#retryCount;

      this.#debugLog('Scheduling retry', {
        retryCount: this.#retryCount,
        delayMs: exponentialBackoffDelay,
        backoffFactor: this.#config.retry.backoffFactor,
      });

      this.#retryTimeoutId = setTimeout(this.#start.bind(this), exponentialBackoffDelay);
    } else {
      this.#debugLog('Stream permanently closed due to error', {
        finalRetryCount: this.#retryCount,
        error: wrappedError,
      });
      this.#state = 'closed';
      this.#cleanup(true);
      this.#closeDeferred.reject(wrappedError);
    }
  }

  /**
   * @param {any} error
   * @returns {boolean}
   */
  #canRetry(error) {
    if (this.#config.retry == null) {
      return false;
    }

    if (this.#retryCount >= this.#config.retry.maxRetryCount) {
      return false;
    }

    if (error == null) {
      return true;
    }

    if (error instanceof CcHttpError) {
      return error.statusCode >= 500 || error.statusCode === 408 || error.statusCode === 429;
    }

    return error instanceof CcClientError;
  }

  /**
   * Construct and dispatch an event
   *
   * @param {string} type
   * @param {any} [data]
   */
  #emit(type, data) {
    try {
      this.#eventTarget.dispatchEvent(new CcStreamEvent(type, data));
    } catch (e) {
      // we catch errors in case one of the listeners throws an error
      this.#onError(new CcClientError(`An error occurred while emitting ${type} event`, 'SSE_CLIENT_ERROR', e));
    }
  }
}

/**
 * Custom event class for CcStream events that carries typed data.
 * Extends the standard Event class to include strongly-typed event data.
 *
 * @template T Type of the event data
 */
export class CcStreamEvent extends Event {
  /** @type {T} */
  #data;

  /**
   * Creates a new CcStreamEvent with the specified type and data.
   *
   * @param {string} type - The event type
   * @param {T} data - The event data payload
   */
  constructor(type, data) {
    super(type);
    this.#data = data;
  }

  /**
   * Gets the data associated with this event.
   *
   * @return {T} The event data
   */
  get data() {
    return this.#data;
  }
}
