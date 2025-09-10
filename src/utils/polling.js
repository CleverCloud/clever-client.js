import { Deferred } from '../lib/utils.js';

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
export class Polling {
  /**
   * The async function to be called on each polling tick.
   * @type {() => Promise<{stop: true, value?: T}|{stop: false}>}
   */
  #asyncCallback;

  /**
   * The delay in milliseconds to wait after each polling operation completes.
   * @type {number}
   */
  #delay;

  /**
   * Optional timeout in milliseconds after which polling will stop.
   * @type {number | undefined}
   */
  #timeout;

  /**
   * The calculated end time for polling timeout. `null` if no timeout is set.
   * @type {number | null}
   */
  #endTime = null;

  /**
   * Indicates whether the polling process is currently active.
   * @type {boolean}
   */
  #running = false;

  /**
   * Timer instance used to schedule the next polling tick.
   * @type {SingleTimer}
   */
  #timer = new SingleTimer();

  /**
   * Deferred promise that resolves when polling completes or rejects on error.
   * @type {Deferred<T> | undefined}
   */
  #deferred;

  /**
   * Creates a new Polling instance.
   *
   * @param {() => Promise<{stop: true, value?: T}|{stop: false}>} asyncCallback
   *        The async function to be called on each polling tick.
   *        Should return an object with:
   *        - stop: true to end polling (optionally with a value)
   *        - stop: false to continue polling
   * @param {number} delay
   *        The delay in milliseconds to wait after each polling operation completes
   *        before starting the next one
   * @param {number} [timeout]
   *        Optional timeout in milliseconds after which polling will stop
   *        and reject with PollingTimeoutError
   */
  constructor(asyncCallback, delay, timeout) {
    this.#asyncCallback = asyncCallback;
    this.#delay = delay;
    this.#timeout = timeout;
  }

  /**
   * Indicates whether the polling process is currently active.
   *
   * @returns {boolean} true if polling is running, false otherwise
   */
  get running() {
    return this.#running;
  }

  /**
   * Starts the polling process.
   * If polling is already running, it will be forcefully stopped before starting anew.
   *
   * @returns {Promise<T>} Resolves with the final value when polling completes successfully
   * @throws {PollingInterruptedError} If polling is manually stopped
   * @throws {PollingTimeoutError} If the specified timeout is reached
   */
  start() {
    // force stop before starting
    if (this.#running) {
      this.#stop({ type: 'error', error: new PollingInterruptedError() });
    }
    // calculate end time if a timeout was provided
    this.#endTime = this.#timeout != null ? Date.now() + this.#timeout : null;
    // create deferred
    this.#deferred = new Deferred();

    // start polling
    this.#running = true;
    this.#tick();

    return this.#deferred.promise;
  }

  /**
   * Stops the polling process immediately.
   * This will reject the promise returned by start() with a PollingInterruptedError.
   */
  stop() {
    this.#stop({ type: 'error', error: new PollingInterruptedError() });
  }

  /**
   * Internal method to stop the polling process.
   * Handles both successful completion and error cases.
   *
   * @param {{type: 'error', error: Error}|{type:'success', value: T}} reason
   *        The reason for stopping:
   *        - For errors: {type: 'error', error: Error}
   *        - For success: {type: 'success', value: T}
   */
  #stop(reason) {
    this.#running = false;
    this.#timer.clear();
    if (reason.type === 'error') {
      this.#deferred?.reject(reason.error);
    } else {
      this.#deferred?.resolve(reason.value);
    }
  }

  #tick() {
    // do nothing if not running
    if (!this.running) {
      return;
    }
    // stop if timeout was reached
    if (this.#isTimedOut()) {
      this.#stop({ type: 'error', error: new PollingTimeoutError() });
      return;
    }

    this.#asyncCallback()
      .then((state) => {
        if (state.stop) {
          this.#stop({ type: 'success', value: state.value });
        }
      })
      .finally(() => {
        if (this.#isTimedOut()) {
          // stop if timeout was reached
          this.#stop({ type: 'error', error: new PollingTimeoutError() });
        } else if (this.running) {
          // program the next tick only if still running
          this.#timer.set(() => this.#tick(), this.#delay);
        }
      });
  }

  #isTimedOut() {
    if (this.#endTime == null) {
      return false;
    }
    return Date.now() >= this.#endTime;
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
   * @type {number | null}
   */
  #id = null;

  /**
   * @returns {number|null} The id of the running timer. `null` if none is running.
   */
  get id() {
    return this.#id;
  }

  /**
   * Starts a timer using `setTimeout` native function.
   *
   * It forces the running one to be stopped before starting.
   *
   * @param {() => any} callback The function to call when the timer elapses.
   * @param {number} [delay=1] The number of milliseconds to wait before calling the `callback`.
   * @param {Array<any>} [args] Optional arguments to pass when the `callback` is called.
   * @returns {number}
   */
  set(callback, delay, ...args) {
    // force stopping current timeout if any
    this.clear();

    this.#id = setTimeout(callback, delay, args);
    return this.#id;
  }

  /**
   * Stops the current running timer.
   */
  clear() {
    if (this.#id != null) {
      clearTimeout(this.#id);
      this.#id = null;
    }
  }
}

/**
 * Error thrown when polling is manually stopped using the stop() method.
 */
export class PollingInterruptedError extends Error {
  constructor() {
    super('Interrupted');
  }
}

/**
 * Error thrown when polling exceeds its specified timeout duration.
 */
export class PollingTimeoutError extends Error {
  constructor() {
    super('Timeout');
  }
}

/**
 * Utility function to check if an error is a PollingTimeoutError.
 *
 * @param {unknown} error The error to check
 * @returns {boolean} true if the error is a PollingTimeoutError, false otherwise
 */
export function isTimeoutError(error) {
  return error instanceof PollingTimeoutError;
}

/**
 * Utility function to check if an error is a PollingInterruptedError.
 *
 * @param {unknown} error The error to check
 * @returns {boolean} true if the error is a PollingInterruptedError, false otherwise
 */
export function isInterruptedError(error) {
  return error instanceof PollingInterruptedError;
}
