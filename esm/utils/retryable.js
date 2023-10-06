const BACKOFF_FACTOR = 1.25;
const INIT_RETRY_TIMEOUT_MS = 1000;
const MAX_RETRY_COUNT = Infinity;

/**
 * Make anything retryable with a max retry and an exponential backoff
 */
export class Retryable {
  /**
   * @param {object} options
   * @param {boolean} options.enabled
   * @param {number} options.backoffFactor
   * @param {number} options.initRetryTimeout
   * @param {number} options.maxRetryCount
   */
  constructor ({
    enabled = false,
    backoffFactor = BACKOFF_FACTOR,
    initRetryTimeout = INIT_RETRY_TIMEOUT_MS,
    maxRetryCount = MAX_RETRY_COUNT,
  }) {
    this.enabled = enabled;
    this.backoffFactor = backoffFactor;
    this.initRetryTimeout = initRetryTimeout;
    this.maxRetryCount = maxRetryCount;
    this.reset();
  }

  reset () {
    this.retryCount = 1;
  }

  /**
   * Can I perform a retry
   * @returns {boolean}
   */
  _canRetry () {
    return this.retryCount < this.maxRetryCount;
  }

  /**
   * @returns {Promise}
   */
  async waitNextRetry () {
    if (!this.enabled) {
      throw new Error('retry is not enabled');
    }

    if (!this._canRetry()) {
      throw new Error('max retry count reached');
    }

    await delay(this.initRetryTimeout * (this.backoffFactor ** this.retryCount));
    this.retryCount++;
  }
}

/**
 * @param {number} delay
 * @returns {Promise}
 */
async function delay (delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
