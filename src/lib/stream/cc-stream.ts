import type { SseMessage } from '../../types/request.types.js';
import { CcClientError, CcHttpError } from '../error/cc-client-errors.js';
import { handleHttpErrors } from '../error/handle-http-errors.js';
import { HeadersBuilder } from '../request/headers-builder.js';
import { isNetworkError, sendRequest, SseResponseBody } from '../request/request.js';
import { combineWithSignal, Deferred } from '../utils.js';
import type { CcStreamCloseReason, CcStreamConfig, CcStreamRequestFactory, CcStreamState } from './cc-stream.types.js';

const LAST_EVENT_ID_HEADER = 'Last-Event-ID';

/**
 * CcStream manages Server-Sent Events (SSE) connections with automatic retry logic,
 * heartbeat monitoring, and event handling. It provides a robust streaming solution
 * for real-time data from the Clever Cloud API.
 */
export class CcStream {
  #requestFactory: CcStreamRequestFactory;
  #config: CcStreamConfig;
  #state: CcStreamState = 'init';
  #eventTarget = new EventTarget();
  #abortController: AbortController | undefined;
  #closeDeferred: Deferred<CcStreamCloseReason> | undefined;
  #lastReceivedMessageId: string | undefined;
  #lastContact: Date | undefined;
  #retryCount = 0;
  #retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  #heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
  #connectionStartTime: Date | null = null;
  #eventListeners = new Set<{ type: string; callback: EventListenerOrEventListenerObject }>();

  /**
   * Creates a new CcStream instance.
   *
   * @param requestFactory - Factory function that creates HTTP requests for the stream
   * @param config - Configuration options for the stream including retry settings and heartbeat
   */
  constructor(requestFactory: CcStreamRequestFactory, config: CcStreamConfig) {
    this.#requestFactory = requestFactory;
    this.#config = config;
  }

  // -- public methods ---

  /**
   * Gets the current state of the stream.
   *
   * @returns The current stream state ('init', 'connecting', 'open', 'paused', or 'closed')
   */
  get state(): CcStreamState {
    return this.#state;
  }

  /**
   * Gets the current retry count for connection attempts.
   *
   * @returns The number of retry attempts made
   */
  get retryCount(): number {
    return this.#retryCount;
  }

  /**
   * Starts the stream. Returns a promise that
   * - resolves when the stream is closed,
   * - rejects when a non-retryable error occurs or when the retry limit is reached.
   */
  start(): Promise<CcStreamCloseReason> {
    if (this.state !== 'init') {
      throw new CcClientError('Cannot start a stream that is not in the "init" state', 'SSE_INVALID_STATE_ERROR');
    }

    if (this.#closeDeferred == null) {
      this.#closeDeferred = new Deferred<CcStreamCloseReason>();
      void this.#start();
    }

    return this.#closeDeferred.promise;
  }

  /**
   * Pauses the stream, stopping the current connection and preventing automatic retries.
   * The stream can be resumed later with the resume() method.
   */
  pause(): void {
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
  resume(): void {
    if (this.state !== 'paused') {
      throw new CcClientError('Cannot resume a stream that is not in the "paused" state', 'SSE_INVALID_STATE_ERROR');
    }

    this.#debugLog('Resuming stream', { previousState: this.#state });
    void this.#start();
  }

  /**
   * Manually closes the stream with an optional reason.
   * Once closed, the stream cannot be reopened.
   *
   * @param reason - The reason for closing the stream
   */
  close(reason: CcStreamCloseReason = { type: 'UNKNOWN' }): void {
    if (this.state === 'closed') {
      return;
    }
    this.#debugLog('Manually closing stream', { reason, previousState: this.#state });
    this.#state = 'closed';
    this.#cleanup(true);
    this.#closeDeferred!.resolve(reason);
  }

  /**
   * Registers a callback to be called when the stream opens successfully.
   *
   * @param callback - Function to call when the stream opens
   * @returns This stream instance for method chaining
   */
  onOpen(callback: () => void): this {
    return this.on('open', () => callback());
  }

  /**
   * Registers a callback to be called when the stream encounters an error.
   *
   * @param callback - Function to call when an error occurs
   * @returns This stream instance for method chaining
   */
  onError(callback: (error: Error) => void): this {
    return this.on<Error>('error', (event) => callback(event.data));
  }

  /**
   * Registers an event listener for the specified event type.
   * This is the generic event listener method used by other on* methods.
   *
   * @param type - The event type to listen for
   * @param callback - Function to call when the event occurs
   * @param options - Event listener options
   * @returns This stream instance for method chaining
   *
   * @template T Type of the event data
   */
  on<T>(type: string, callback: (event: CcStreamEvent<T>) => void, options?: AddEventListenerOptions | boolean): this {
    this.#eventTarget.addEventListener(type, callback as EventListener, options);
    this.#eventListeners.add({ type, callback: callback as EventListener });
    return this;
  }

  // -- private methods ---

  /**
   * Logs debug information if debug mode is enabled
   * @param message - The debug message
   * @param data - Optional data to include in the log
   */
  #debugLog(message: string, data?: unknown): void {
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

  async #start(): Promise<void> {
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
      if (request.signal != null) {
        combineWithSignal(this.#abortController, request.signal);
      }

      const headersBuilder = new HeadersBuilder(request.headers).acceptEventStream();
      if (this.#lastReceivedMessageId != null) {
        headersBuilder.withHeader(LAST_EVENT_ID_HEADER, this.#lastReceivedMessageId);
        this.#debugLog('Resuming from last event ID', { lastEventId: this.#lastReceivedMessageId });
      }

      const response = await sendRequest<SseResponseBody>({
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
    } catch (error: unknown) {
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
   * @param clearListeners - Whether to also clear event listeners
   */
  #cleanup(clearListeners = false): void {
    this.#debugLog('Cleaning up stream resources');
    clearTimeout(this.#retryTimeoutId ?? undefined);
    clearInterval(this.#heartbeatIntervalId ?? undefined);
    if (clearListeners) {
      this.#eventListeners.forEach(({ type, callback }) => this.#eventTarget.removeEventListener(type, callback));
      this.#eventListeners.clear();
    }
    this.#abortController?.abort();
  }

  /**
   * When SSE is opened
   */
  #onOpen(): void {
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
      const diff = now.getTime() - (this.#lastContact?.getTime() ?? now.getTime());
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
   * @param message - The received SSE message
   */
  #onMessage(message: SseMessage): void {
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
          const reason = JSON.parse(message.data) as { endedBy?: string };
          this.#debugLog('End of stream received', { reason });
          this.close({ type: reason.endedBy ?? 'UNKNOWN' });
        } catch (e: unknown) {
          this.#debugLog('Failed to parse END_OF_STREAM data', {
            data: message.data,
            error: e,
          });
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

  #onClose(): void {
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
   * @param error - The error that occurred
   */
  #onError(error: unknown): void {
    if (this.#state === 'closed' || this.#state === 'paused') {
      this.#debugLog('Error event ignored', { currentState: this.#state, error });
      return;
    }

    this.#debugLog('Stream error occurred', error);

    this.#cleanup();

    const wrappedError = isNetworkError(error as Parameters<typeof isNetworkError>[0])
      ? new CcClientError('Failed to establish/maintain the connection with the server', 'SSE_SERVER_ERROR', error)
      : error;

    const canRetry = this.#canRetry(wrappedError);
    this.#debugLog('Retry decision', {
      canRetry,
      retryCount: this.#retryCount,
      maxRetry: this.#config.retry?.maxRetryCount,
    });

    if (canRetry && this.#config.retry != null) {
      const retry = this.#config.retry;
      this.#state = 'paused';
      this.#emit('error', wrappedError);

      this.#retryCount++;
      const exponentialBackoffDelay = retry.initRetryTimeout * retry.backoffFactor ** this.#retryCount;

      this.#debugLog('Scheduling retry', {
        retryCount: this.#retryCount,
        delayMs: exponentialBackoffDelay,
        backoffFactor: retry.backoffFactor,
      });

      this.#retryTimeoutId = setTimeout(() => {
        void this.#start();
      }, exponentialBackoffDelay);
    } else {
      this.#debugLog('Stream permanently closed due to error', {
        finalRetryCount: this.#retryCount,
        error: wrappedError,
      });
      this.#state = 'closed';
      this.#cleanup(true);
      this.#closeDeferred?.reject(wrappedError);
    }
  }

  #canRetry(error: unknown): boolean {
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
   * @param type - The event type
   * @param data - The event data payload
   */
  #emit(type: string, data?: unknown): void {
    try {
      this.#eventTarget.dispatchEvent(new CcStreamEvent(type, data));
    } catch (e: unknown) {
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
export class CcStreamEvent<T> extends Event {
  #data: T;

  /**
   * Creates a new CcStreamEvent with the specified type and data.
   *
   * @param type - The event type
   * @param data - The event data payload
   */
  constructor(type: string, data: T) {
    super(type);
    this.#data = data;
  }

  /**
   * Gets the data associated with this event.
   *
   * @returns The event data
   */
  get data(): T {
    return this.#data;
  }
}
