/**
 * This class handles Polling process.
 * It doesn't really run a callback at a certain rate.
 * Instead, after each polling tick, it waits for a given delay before doing a new tick.
 * This way, the callback can take more time than the delay, it's not going to stack the processes.
 *
 * Also, good care is taken of the stopping process: It ensures that the polling process really stops even if the
 * stop command is called while the callback is running or while the timer is waiting for the nex tick.
 *
 * @template T
 */
export class Polling {
  /**
   *
   * @param {() => Promise<{stop: true, value?: T}|{stop: false}>} asyncCallback The function to be called at each polling tick. If the function returns true, the polling process will be stopped.
   * @param {number} delay The delay to wait after each polling tick (in milliseconds).
   * @param {number} [timeout] The time after which the polling should be stopped.
   */
  constructor(asyncCallback, delay, timeout) {
    this._asyncCallback = asyncCallback;
    this._delay = delay;
    this._timeout = timeout;
    /** @type {null | number} */
    this._endTime = null;

    this._running = false;
    this._timer = new SingleTimer();
  }

  /**
   * @returns {boolean} Whether the polling process is running
   */
  get running() {
    return this._running;
  }

  /**
   * Starts the polling process. If it was already running, we force stopping it before.
   * @returns {Promise<T>}
   * @throws {Error} if interrupted or if timeout
   */
  start() {
    // force stop before starting
    if (this._running) {
      this.#stop({ type: 'error', error: new PollingInterruptedError() });
    }
    // calculate end time if a timeout was provided
    this._endTime = this._timeout != null ? Date.now() + this._timeout : null;
    // create deferred
    this._deferred = new Deferred();

    // start polling
    this._running = true;
    this.#tick();

    return this._deferred.promise;
  }

  stop() {
    this.#stop({ type: 'error', error: new PollingInterruptedError() });
  }

  /**
   * Stops the polling process.
   * @param {{type: 'error', error: Error}|{type:'success', value: T}} reason
   */
  #stop(reason) {
    this._running = false;
    this._timer.clear();
    if (reason.type === 'error') {
      this._deferred?.reject(reason.error);
    } else {
      this._deferred?.resolve(reason.value);
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

    this._asyncCallback()
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
          this._timer.set(() => this.#tick(), this._delay);
        }
      });
  }

  #isTimedOut() {
    if (this._endTime == null) {
      return false;
    }
    return Date.now() >= this._endTime;
  }
}

/**
 * This class is a wrapper around `setTimeout` and `clearTimeout` native functions.
 * It ensures that only one timer is running at a time.
 * If one trys to start a new one, it ensures that the running one is stopped before.
 */
class SingleTimer {
  constructor() {
    /** @type {number} */
    this._id = null;
  }

  /**
   * @returns {number|null} The id of the running timer. `null` if none is running.
   */
  get id() {
    return this._id;
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

    this._id = setTimeout(callback, delay, args);
    return this._id;
  }

  /**
   * Stops the current running timer.
   */
  clear() {
    if (this._id != null) {
      clearTimeout(this._id);
      this._id = null;
    }
  }
}

export class PollingInterruptedError extends Error {
  constructor() {
    super('Interrupted');
  }
}

export class PollingTimeoutError extends Error {
  constructor() {
    super('Timeout');
  }
}

/**
 * @param {unknown} error
 */
export function isTimeoutError(error) {
  return error instanceof PollingTimeoutError;
}

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
