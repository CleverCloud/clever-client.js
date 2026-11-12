import type { SseMessage } from '../../types/request.types.ts';
import { isCcClientError, isCcHttpError, isNetworkError } from '../../utils/error-utils.ts';
import type { NetworkErrorCode } from '../error/cc-client-errors.ts';
import { CcClientError } from '../error/cc-client-errors.ts';
import { handleHttpErrors } from '../error/handle-http-errors.ts';
import { asNetworkError, isFetchNetworkError } from '../error/network-error.ts';
import { HeadersBuilder } from '../request/headers-builder.ts';
import { sendRequest, SseResponseBody } from '../request/request.ts';
import { combineWithSignal, Deferred } from '../utils.ts';
import type {
  CcStreamCloseReason,
  CcStreamConfig,
  CcStreamRequestFactory,
  CcStreamRetry,
  CcStreamState,
} from './cc-stream.types.ts';
import { readSseResponseBody } from './sse-response-body-reader.ts';

const LAST_EVENT_ID_HEADER = 'Last-Event-ID';

/**
 * Network failures a stream reconnects through once it has been open, against the advice the error itself gives.
 *
 * That advice answers for a one-shot request, where a name resolving to nothing is a typo and sending it again only
 * fails slower. A stream that has been open asks a different question: the host did resolve and this machine did have
 * an address, so whatever took them away is something that comes back — a laptop waking before its resolver, a VPN
 * reconnecting, an interface not given its address yet, a local port range that frees up again. Outliving those is
 * what a stream is for, and what it is configured for: `maxRetryCount` defaults to `Infinity`.
 *
 * Having been open is the whole condition. Before that the advice is right, and a stream pointed at a host nobody can
 * resolve still fails on its first attempt instead of retrying a typo for ever.
 */
const RECONNECTABLE_NETWORK_CODES = new Set<NetworkErrorCode>(['ENOTFOUND', 'EADDRNOTAVAIL']);

/**
 * CcStream manages Server-Sent Events (SSE) connections with automatic retry logic,
 * heartbeat monitoring, and event handling. It provides a robust streaming solution
 * for real-time data from the Clever Cloud API.
 */
export class CcStream {
  private _requestFactory: CcStreamRequestFactory;
  private _config: CcStreamConfig;
  private _state: CcStreamState = 'init';
  private _eventTarget = new EventTarget();
  private _abandonConnectionAttempt: (() => void) | undefined;
  private _requestSignal: AbortSignal | undefined;
  private _closeDeferred: Deferred<CcStreamCloseReason> | undefined;
  private _lastReceivedMessageId: string | undefined;
  private _lastContact: Date | undefined;
  private _retryCount = 0;
  private _hasBeenOpen = false;
  private _retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
  private _connectionStartTime: Date | null = null;
  private _eventListeners = new Set<{ type: string; callback: EventListenerOrEventListenerObject }>();

  /**
   * Creates a new CcStream instance.
   *
   * @param requestFactory - Factory function that creates HTTP requests for the stream
   * @param config - Configuration options for the stream including retry settings and heartbeat
   */
  constructor(requestFactory: CcStreamRequestFactory, config: CcStreamConfig) {
    this._requestFactory = requestFactory;
    this._config = config;
  }

  // -- public methods ---

  /**
   * Gets the current state of the stream.
   *
   * @returns The current stream state ('init', 'connecting', 'open', 'retrying', 'paused', or 'closed')
   */
  get state(): CcStreamState {
    return this._state;
  }

  /**
   * Gets the current retry count for connection attempts.
   *
   * @returns The number of retry attempts made
   */
  get retryCount(): number {
    return this._retryCount;
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

    if (this._closeDeferred == null) {
      this._closeDeferred = new Deferred<CcStreamCloseReason>();
      void this._start();
    }

    return this._closeDeferred.promise;
  }

  /**
   * Pauses the stream, stopping the current connection and preventing automatic retries.
   * The stream can be resumed later with the resume() method.
   *
   * A stream can be paused while open, while connecting (the attempt is aborted) and while retrying (the retry is
   * cancelled).
   */
  pause(): void {
    if (this._state !== 'open' && this._state !== 'connecting' && this._state !== 'retrying') {
      throw new CcClientError(
        'Cannot pause a stream that is not open, connecting or retrying',
        'SSE_INVALID_STATE_ERROR',
      );
    }

    this._debugLog('Pausing stream', { previousState: this._state });
    this._state = 'paused';
    this._cleanup();
  }

  /**
   * Resumes a paused stream, attempting to reconnect and continue streaming.
   *
   * On a retrying stream, it reconnects right away. Either way, the retry count goes on: only a stream that opens
   * starts it over, so that resuming cannot retry past `maxRetryCount`.
   */
  resume(): void {
    if (this.state !== 'paused' && this.state !== 'retrying') {
      throw new CcClientError(
        'Cannot resume a stream that is not in the "paused" or "retrying" state',
        'SSE_INVALID_STATE_ERROR',
      );
    }

    this._debugLog('Resuming stream', { previousState: this._state });
    // the retry of a retrying stream would start a second connection
    this._cleanup();
    void this._start();
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
    this._debugLog('Manually closing stream', { reason, previousState: this._state });
    this._state = 'closed';
    this._cleanup(true);
    this._closeDeferred!.resolve(reason);
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
   * Registers a callback to be called when the stream schedules a retry after a failed attempt.
   *
   * The stream is `retrying` when the callback runs: calling pause() from it cancels the retry. A failure that
   * is not retried calls nothing: it closes the stream and rejects the promise start() returned.
   *
   * @param callback - Function to call with the retry number and when the next attempt happens
   * @returns This stream instance for method chaining
   */
  onRetry(callback: (retry: CcStreamRetry) => void): this {
    return this.on<CcStreamRetry>('retry', (event) => callback(event.data));
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
    this._eventTarget.addEventListener(type, callback as EventListener, options);
    this._eventListeners.add({ type, callback: callback as EventListener });
    return this;
  }

  // -- private methods ---

  /**
   * Logs debug information if debug mode is enabled
   * @param message - The debug message
   * @param data - Optional data to include in the log
   */
  private _debugLog(message: string, data?: unknown): void {
    if (this._config.isDebugEnabled) {
      const timestamp = new Date().toISOString();
      const logMessage = `[CcStream] [${timestamp}] ${message}`;
      if (data !== undefined) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  private async _start(): Promise<void> {
    // #cleanup abandons this attempt. Example: after pause() then resume(), this attempt may still get its response
    // or its error while the new one runs, and must ignore them.
    const connectionAttempt = { isAbandoned: false };
    const requestAbortController = new AbortController();
    this._abandonConnectionAttempt = () => {
      connectionAttempt.isAbandoned = true;
      requestAbortController.abort();
    };
    this._connectionStartTime = new Date();
    if (this._config.retry) {
      this._debugLog(
        `Starting stream connection (attempt ${this._retryCount + 1}/${this._config.retry.maxRetryCount + 1})`,
      );
    } else {
      this._debugLog(`Starting stream connection`);
    }

    try {
      this._state = 'connecting';
      this._debugLog('State changed to connecting', { state: this._state, retryCount: this._retryCount });

      this._debugLog(`Forging HTTP request`);
      const request = await this._requestFactory();

      // pause() or close() was called while the request was being built
      if (connectionAttempt.isAbandoned) {
        this._debugLog('Connection attempt abandoned while building the request', { state: this._state });
        return;
      }

      this._watchRequestSignal(request.signal);
      if (request.signal != null) {
        combineWithSignal(requestAbortController, request.signal);
      }

      const headersBuilder = new HeadersBuilder(request.headers).acceptEventStream();
      if (this._lastReceivedMessageId != null) {
        headersBuilder.withHeader(LAST_EVENT_ID_HEADER, this._lastReceivedMessageId);
        this._debugLog('Resuming from last event ID', { lastEventId: this._lastReceivedMessageId });
      }

      const response = await sendRequest<SseResponseBody>({
        ...request,
        cache: null,
        headers: headersBuilder.build(),
        signal: requestAbortController.signal,
      });

      // pause() or close() was called after the response arrived, too late to abort it
      if (connectionAttempt.isAbandoned) {
        this._debugLog('Connection attempt abandoned after the response arrived', { state: this._state });
        return;
      }

      this._debugLog('HTTP response received', {
        status: response.status,
        contentType: response.headers.get('content-type'),
      });

      handleHttpErrors(request, response);

      if (!(response.body instanceof SseResponseBody)) {
        this._debugLog('Invalid response body type', { bodyType: typeof response.body });
        this._onError(
          new CcClientError('Invalid response content type for an SSE', 'SSE_INVALID_CONTENT_TYPE', response),
        );
        return;
      }

      this._onOpen();

      // a listener of the `open` event may have paused or closed the stream
      if (connectionAttempt.isAbandoned) {
        this._debugLog('Connection attempt abandoned by an open listener', { state: this._state });
        return;
      }

      // each callback ignores what arrives once this attempt is abandoned
      await readSseResponseBody(response.body, {
        onMessage: (message) => {
          if (!connectionAttempt.isAbandoned) {
            this._onMessage(message);
          }
        },
        onClose: () => {
          if (!connectionAttempt.isAbandoned) {
            this._onClose();
          }
        },
        onError: (error) => {
          if (!connectionAttempt.isAbandoned) {
            // A socket dying mid-stream rejects raw, past the point where sendRequest could name it, so
            // it is named here instead — otherwise it would reach consumers as an unexplained SSE error.
            this._onError(asNetworkError(error, request) ?? error);
          }
        },
      });
    } catch (error: unknown) {
      if (connectionAttempt.isAbandoned) {
        this._debugLog('Error ignored, the connection attempt was abandoned', { state: this._state, error });
      } else if (isCcClientError(error)) {
        this._onError(error);
      } else if (error === requestAbortController.signal.reason) {
        // an abort is not the server closing the response: `sendRequest` rejects with the reason of the signal
        this._onError(error);
      } else {
        this._onError(
          new CcClientError('Server closed the response without a END_OF_STREAM event', 'SSE_SERVER_ERROR', error),
        );
      }
    }
  }

  /**
   * Clears any active timeouts and intervals to prevent memory leaks.
   * @param clearListeners - Whether to also clear event listeners
   */
  private _cleanup(clearListeners = false): void {
    this._debugLog('Cleaning up stream resources');
    clearTimeout(this._retryTimeoutId ?? undefined);
    clearInterval(this._heartbeatIntervalId ?? undefined);
    if (clearListeners) {
      this._eventListeners.forEach(({ type, callback }) => this._eventTarget.removeEventListener(type, callback));
      this._eventListeners.clear();
      this._requestSignal?.removeEventListener('abort', this._onRequestSignalAbort);
    }
    this._abandonConnectionAttempt?.();
  }

  /**
   * Listens to the signal of the request, which is usually the same one from an attempt to the next.
   *
   * @param signal - The signal of the request the current attempt sends
   */
  private _watchRequestSignal(signal: AbortSignal | undefined): void {
    if (signal === this._requestSignal) {
      return;
    }
    this._requestSignal?.removeEventListener('abort', this._onRequestSignalAbort);
    this._requestSignal = signal;
    this._requestSignal?.addEventListener('abort', this._onRequestSignalAbort);
  }

  /**
   * When the signal of the request aborts.
   *
   * While connecting or open, the signal aborts the connection, which ends in #onError. Between two connections,
   * retrying or paused, nothing else would notice it before the next attempt.
   */
  private _onRequestSignalAbort = (): void => {
    if (this._state === 'retrying' || this._state === 'paused') {
      this._closeWithError(this._requestSignal!.reason);
    }
  };

  /**
   * When SSE is opened
   */
  private _onOpen(): void {
    const connectionTime = this._connectionStartTime
      ? new Date().getTime() - this._connectionStartTime.getTime()
      : null;
    this._debugLog('Stream opened successfully', {
      connectionTimeMs: connectionTime,
      retryCount: this._retryCount,
    });

    this._state = 'open';
    this._lastContact = new Date();
    this._retryCount = 0;
    this._hasBeenOpen = true;

    this._heartbeatIntervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - (this._lastContact?.getTime() ?? now.getTime());
      if (diff > this._config.heartbeatPeriod) {
        this._debugLog('Heartbeat timeout detected', {
          timeSinceLastContact: diff,
          heartbeatPeriod: this._config.heartbeatPeriod,
        });
        this._onError(
          new CcClientError(
            `Failed to receive heartbeat within ${this._config.heartbeatPeriod}ms period`,
            'SSE_HEALTH_ERROR',
          ),
        );
      }
    }, this._config.healthcheckInterval);

    // last, so that what a listener does to the stream is not undone
    this._emit('open');
  }

  /**
   * when a message is received through SSE
   *
   * @param message - The received SSE message
   */
  private _onMessage(message: SseMessage): void {
    this._lastContact = new Date();

    this._debugLog('SSE message received', {
      event: message.event,
      id: message.id,
      dataLength: message.data ? message.data.length : 0,
      timestamp: this._lastContact.toISOString(),
    });

    switch (message.event) {
      case 'HEARTBEAT':
        this._debugLog('Heartbeat received');
        return;
      case 'END_OF_STREAM': {
        try {
          const reason = JSON.parse(message.data) as { endedBy?: string };
          this._debugLog('End of stream received', { reason });
          this.close({ type: reason.endedBy ?? 'UNKNOWN' });
        } catch (e: unknown) {
          this._debugLog('Failed to parse END_OF_STREAM data', {
            data: message.data,
            error: e,
          });
          this._onError(
            new CcClientError(`Expect JSON for END_OF_STREAM event but got "${message.data}"`, 'SSE_SERVER_ERROR', e),
          );
        }
        return;
      }
      default: {
        if (message.id?.length > 0) {
          this._lastReceivedMessageId = message.id;
        }

        this._debugLog('Emitting custom event', { event: message.event, hasData: !!message.data });
        this._emit(message.event, message.data);
      }
    }
  }

  private _onClose(): void {
    if (this._state === 'closed' || this._state === 'retrying' || this._state === 'paused') {
      this._debugLog('Close event ignored', { currentState: this._state });
      return;
    }
    // #onError tells this apart from the body ending because the signal of the request aborted
    this._debugLog('Stream closed unexpectedly by server', {
      state: this._state,
      lastMessageId: this._lastReceivedMessageId,
      retryCount: this._retryCount,
    });
    this._onError(new CcClientError('Server closed the response without a END_OF_STREAM event', 'SSE_SERVER_ERROR'));
  }

  /**
   * when the SSE has an error
   * @param error - The error that occurred
   */
  private _onError(error: unknown): void {
    if (this._state === 'closed' || this._state === 'retrying' || this._state === 'paused') {
      this._debugLog('Error event ignored', { currentState: this._state, error });
      return;
    }

    this._debugLog('Stream error occurred', error);

    // Reconnecting would undo what the consumer asked for, whatever failed on the way. The abort may not be what
    // failed: a request factory rejecting after it, or a signal aborting with a reason that is a CcClientError.
    if (this._requestSignal?.aborted === true) {
      this._closeWithError(this._requestSignal.reason);
      return;
    }

    this._cleanup();

    // Errors the client raised already say what went wrong, and a CcNetworkError says which network
    // failure it was; only a raw one needs to be named here so that it can be retried at all.
    const wrappedError =
      !isCcClientError(error) && isFetchNetworkError(error)
        ? new CcClientError('Failed to establish/maintain the connection with the server', 'SSE_SERVER_ERROR', error)
        : error;

    const canRetry = this._canRetry(wrappedError);
    this._debugLog('Retry decision', {
      canRetry,
      retryCount: this._retryCount,
      maxRetry: this._config.retry?.maxRetryCount,
    });

    if (canRetry && this._config.retry != null) {
      const retry = this._config.retry;
      this._state = 'retrying';

      // before counting this retry, so that the first one waits initRetryTimeout
      const exponentialBackoffDelay = retry.initRetryTimeout * retry.backoffFactor ** this._retryCount;
      this._retryCount++;

      this._debugLog('Scheduling retry', {
        retryCount: this._retryCount,
        delayMs: exponentialBackoffDelay,
        backoffFactor: retry.backoffFactor,
      });

      this._retryTimeoutId = setTimeout(() => {
        void this._start();
      }, exponentialBackoffDelay);

      // Wrap nullish failures only for the event; keep the original value for the final rejection.
      const retryError = isCcClientError(wrappedError)
        ? wrappedError
        : new CcClientError(
            'Failed to establish/maintain the connection with the server',
            'SSE_SERVER_ERROR',
            wrappedError,
          );

      // only once the retry is scheduled, so that a listener can cancel it with pause()
      this._emit('retry', {
        error: retryError,
        retryCount: this._retryCount,
        maxRetryCount: retry.maxRetryCount,
        retryAt: new Date(Date.now() + exponentialBackoffDelay),
      } satisfies CcStreamRetry);
    } else {
      this._closeWithError(wrappedError);
    }
  }

  /**
   * Closes the stream for good, rejecting the promise start() returned.
   *
   * @param error - The error start() rejects with
   */
  private _closeWithError(error: unknown): void {
    this._debugLog('Stream permanently closed due to error', {
      finalRetryCount: this._retryCount,
      error,
    });
    this._state = 'closed';
    this._cleanup(true);
    this._closeDeferred?.reject(error);
  }

  private _canRetry(error: unknown): boolean {
    if (this._config.retry == null) {
      return false;
    }

    if (this._retryCount >= this._config.retry.maxRetryCount) {
      return false;
    }

    if (error == null) {
      return true;
    }

    // The error knows better than this method does, and it is the same question consumers ask it. The one thing
    // this method knows that the error cannot is whether the stream ever connected, see RECONNECTABLE_NETWORK_CODES.
    if (isNetworkError(error)) {
      return (
        error.isWorthRetrying() ||
        (this._hasBeenOpen && error.networkCode != null && RECONNECTABLE_NETWORK_CODES.has(error.networkCode))
      );
    }

    if (isCcHttpError(error)) {
      return error.statusCode >= 500 || error.statusCode === 408 || error.statusCode === 429;
    }

    return isCcClientError(error);
  }

  /**
   * Construct and dispatch an event
   *
   * @param type - The event type
   * @param data - The event data payload
   */
  private _emit(type: string, data?: unknown): void {
    try {
      this._eventTarget.dispatchEvent(new CcStreamEvent(type, data));
    } catch (e: unknown) {
      // we catch errors in case one of the listeners throws an error
      this._onError(new CcClientError(`An error occurred while emitting ${type} event`, 'SSE_CLIENT_ERROR', e));
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
  private _data: T;

  /**
   * Creates a new CcStreamEvent with the specified type and data.
   *
   * @param type - The event type
   * @param data - The event data payload
   */
  constructor(type: string, data: T) {
    super(type);
    this._data = data;
  }

  /**
   * Gets the data associated with this event.
   *
   * @returns The event data
   */
  get data(): T {
    return this._data;
  }
}
