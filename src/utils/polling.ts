import { createBrand, Deferred, hasBrand, setBrand } from '../lib/utils.ts';

// Cross-version contracts, see createBrand(). A composite command that polls lets these errors reach
// its caller, who may test them with the predicates of another copy of this package.
const POLLING_INTERRUPTED_ERROR_BRAND = createBrand('PollingInterruptedError');
const POLLING_TIMEOUT_ERROR_BRAND = createBrand('PollingTimeoutError');

/**
 * A robust polling implementation that handles asynchronous operations with controlled timing.
 *
 * Unlike traditional interval-based polling, this class implements a delay-after-completion approach:
 * After each polling operation completes, it waits for a specified delay before initiating the next operation.
 * This prevents operation stacking when individual operations take longer than the delay period.
 *
 * Key features:
 * - Guaranteed operation spacing using delay-after-completion
 * - Safe stopping mechanism that works even during operation execution
 * - Optional timeout support
 * - Promise-based API with type safety
 *
 * @template T The type of the value that will be resolved when polling completes successfully
 *
 * @example
 * // Basic polling example - check for task completion
 * const polling = new Polling(
 *   async () => {
 *     const result = await checkLongRunningProcess();
 *     return result.completed ? { stop: true, value: result } : { stop: false };
 *   },
 *   1000 // Poll every 1 second
 * );
 *
 * try {
 *   const result = await polling.start();
 *   console.log('Task completed:', result);
 * } catch (error) {
 *   if (isTimeoutError(error)) {
 *     console.log('Polling timed out');
 *   } else if (isInterruptedError(error)) {
 *     console.log('Polling was interrupted');
 *   } else {
 *     console.error('Unexpected error', error);
 *   }
 * }
 *
 * @example
 * // Polling with timeout
 * const pollingWithTimeout = new Polling(
 *   async () => {
 *     const result = await checkLongRunningProcess();
 *     return result.completed ? { stop: true, value: result } : { stop: false };
 *   },
 *   500,  // Poll every 500ms
 *   10000 // Timeout after 10 seconds
 * );
 *
 * pollingWithTimeout.start()
 *   .then(result => console.log('Task completed:', result);)
 *   .catch(error => console.error('Failed:', error.message));
 */
export class Polling<T> {
  /**
   * The async function to be called on each polling tick.
   */
  private _asyncCallback: () => Promise<{ stop: true; value?: T } | { stop: false }>;

  /**
   * The delay in milliseconds to wait after each polling operation completes.
   */
  private _delay: number;

  /**
   * Optional timeout in milliseconds after which polling will stop.
   */
  private _timeout: number | undefined;

  /**
   * The calculated end time for polling timeout. `null` if no timeout is set.
   */
  private _endTime: number | null = null;

  /**
   * Indicates whether the polling process is currently active.
   */
  private _running = false;

  /**
   * Timer instance used to schedule the next polling tick.
   */
  private _timer = new SingleTimer();

  /**
   * Deferred promise that resolves when polling completes or rejects on error.
   */
  private _deferred: Deferred<T> | undefined;

  /**
   * Creates a new Polling instance.
   *
   * @param asyncCallback
   *        The async function to be called on each polling tick.
   *        Should return an object with:
   *        - stop: true to end polling (optionally with a value)
   *        - stop: false to continue polling
   * @param delay
   *        The delay in milliseconds to wait after each polling operation completes
   *        before starting the next one
   * @param timeout
   *        Optional timeout in milliseconds after which polling will stop
   *        and reject with PollingTimeoutError
   */
  constructor(
    asyncCallback: () => Promise<{ stop: true; value?: T } | { stop: false }>,
    delay: number,
    timeout?: number,
  ) {
    this._asyncCallback = asyncCallback;
    this._delay = delay;
    this._timeout = timeout;
  }

  /**
   * Indicates whether the polling process is currently active.
   *
   * @returns true if polling is running, false otherwise
   */
  get running(): boolean {
    return this._running;
  }

  /**
   * Starts the polling process.
   * If polling is already running, it will be forcefully stopped before starting anew.
   *
   * @returns Resolves with the final value when polling completes successfully
   * @throws {PollingInterruptedError} If polling is manually stopped
   * @throws {PollingTimeoutError} If the specified timeout is reached
   */
  start(): Promise<T> {
    // force stop before starting
    if (this._running) {
      this._stop({ type: 'error', error: new PollingInterruptedError() });
    }
    // calculate end time if a timeout was provided
    this._endTime = this._timeout != null ? Date.now() + this._timeout : null;
    // create deferred
    this._deferred = new Deferred<T>();

    // start polling
    this._running = true;
    this._tick();

    return this._deferred.promise;
  }

  /**
   * Stops the polling process immediately.
   * This will reject the promise returned by start() with a PollingInterruptedError.
   */
  stop(): void {
    this._stop({ type: 'error', error: new PollingInterruptedError() });
  }

  /**
   * Internal method to stop the polling process.
   * Handles both successful completion and error cases.
   *
   * @param reason
   *        The reason for stopping:
   *        - For errors: {type: 'error', error: Error}
   *        - For success: {type: 'success', value: T}
   */
  private _stop(reason: { type: 'error'; error: Error } | { type: 'success'; value?: T }): void {
    this._running = false;
    this._timer.clear();
    if (reason.type === 'error') {
      this._deferred?.reject(reason.error);
    } else {
      this._deferred?.resolve(reason.value as T);
    }
  }

  private _tick(): void {
    // do nothing if not running
    if (!this.running) {
      return;
    }
    // stop if timeout was reached
    if (this._isTimedOut()) {
      this._stop({ type: 'error', error: new PollingTimeoutError() });
      return;
    }

    void this._asyncCallback()
      .then((state) => {
        if (state.stop) {
          this._stop({ type: 'success', value: state.value });
        }
      })
      .finally(() => {
        if (this._isTimedOut()) {
          // stop if timeout was reached
          this._stop({ type: 'error', error: new PollingTimeoutError() });
        } else if (this.running) {
          // program the next tick only if still running
          this._timer.set(() => this._tick(), this._delay);
        }
      });
  }

  private _isTimedOut(): boolean {
    if (this._endTime == null) {
      return false;
    }
    return Date.now() >= this._endTime;
  }
}

/**
 * A utility class that provides safe timer management.
 *
 * Wraps the native `setTimeout` and `clearTimeout` functions to ensure
 * that only one timer can be active at a time. When starting a new timer,
 * any existing timer is automatically cleared first to prevent memory leaks
 * and ensure clean state management.
 */
class SingleTimer {
  /**
   * The ID of the currently active timer, or null if no timer is running.
   */
  private _id: number | null = null;

  /**
   * @returns The id of the running timer. `null` if none is running.
   */
  get id(): number | null {
    return this._id;
  }

  /**
   * Starts a timer using `setTimeout` native function.
   *
   * It forces the running one to be stopped before starting.
   *
   * @param callback The function to call when the timer elapses.
   * @param delay The number of milliseconds to wait before calling the `callback`.
   * @param args Optional arguments to pass when the `callback` is called.
   */
  set(callback: () => unknown, delay?: number, ...args: Array<unknown>): number {
    // force stopping current timeout if any
    this.clear();

    this._id = setTimeout(callback, delay, args);
    return this._id;
  }

  /**
   * Stops the current running timer.
   */
  clear(): void {
    if (this._id != null) {
      clearTimeout(this._id);
      this._id = null;
    }
  }
}

/**
 * Error thrown when polling is manually stopped using the stop() method.
 */
export class PollingInterruptedError extends Error {
  static {
    Object.defineProperty(this.prototype, 'name', {
      value: 'PollingInterruptedError',
      writable: true,
      configurable: true,
    });
    setBrand(this.prototype, POLLING_INTERRUPTED_ERROR_BRAND);
  }

  constructor() {
    super('Interrupted');
  }
}

/**
 * Error thrown when polling exceeds its specified timeout duration.
 */
export class PollingTimeoutError extends Error {
  static {
    Object.defineProperty(this.prototype, 'name', { value: 'PollingTimeoutError', writable: true, configurable: true });
    setBrand(this.prototype, POLLING_TIMEOUT_ERROR_BRAND);
  }

  constructor() {
    super('Timeout');
  }
}

/**
 * Utility function to check if an error is a PollingTimeoutError.
 *
 * @param error The error to check
 * @returns true if the error is a PollingTimeoutError, false otherwise
 */
export function isTimeoutError(error: unknown): boolean {
  return hasBrand(error, POLLING_TIMEOUT_ERROR_BRAND);
}

/**
 * Utility function to check if an error is a PollingInterruptedError.
 *
 * @param error The error to check
 * @returns true if the error is a PollingInterruptedError, false otherwise
 */
export function isInterruptedError(error: unknown): boolean {
  return hasBrand(error, POLLING_INTERRUPTED_ERROR_BRAND);
}
