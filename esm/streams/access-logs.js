import CleverCloudSse from './clever-cloud-sse.js';

const ACCESS_LOG_EVENT_NAME = 'ACCESS_LOG';

/**
 * CleverCloud Application' access logs stream
 */
export class ApplicationAccessLogStream extends CleverCloudSse {

  /**
   * @param {object} options
   * @param {string} options.apiHost
   * @param {object} options.tokens
   * @param {string} options.tokens.OAUTH_CONSUMER_KEY
   * @param {string} options.tokens.OAUTH_CONSUMER_SECRET
   * @param {string} options.tokens.API_OAUTH_TOKEN
   * @param {string} options.tokens.API_OAUTH_TOKEN_SECRET
   * @param {string} options.ownerId
   * @param {string} options.appId
   * @param {object} options.retryConfiguration
   * @param {boolean} options.retryConfiguration.enabled
   * @param {number} options.retryConfiguration.backoffFactor
   * @param {number} options.retryConfiguration.initRetryTimeout
   * @param {number} options.retryConfiguration.maxRetryCount
   * @param {Date} options.since
   * @param {Date} options.until
   * @param {number} options.limit
   * @param {string} options.field[]
   * @param {number} options.throttleElements
   * @param {number} options.throttlePerInMilliseconds
   *
   */
  constructor ({ apiHost, tokens, ownerId, appId, retryConfiguration, connectionTimeout, ...options }) {
    super(apiHost, tokens, retryConfiguration ?? {}, connectionTimeout);
    this._ownerId = ownerId;
    this._appId = appId;
    this._options = options;

    // Count the number of logs, so we can update the "limit" query param on pause/resume or error/retry
    this._logsCount = 0;
    this.onLog(() => {
      this._logsCount++;
    });
  }

  /**
   * compute full URL with query params
   * @returns {string}
   */
  getUrl () {
    const url = this.buildUrl(
      `/v4/accesslogs/organisations/${this._ownerId}/applications/${this._appId}/accesslogs`,
      {
        ...this._options,
        // in case of pause() then resume():
        // we don' t want N another logs, we want the initial passed number less the events count already received
        limit: this._computedLimit(),
      },
    );

    return url;
  }

  // compute the number of events to retrieve, based on elements already received
  _computedLimit () {
    if (this._options.limit == null) {
      return null;
    }
    return Math.max(this._options.limit - this._logsCount, 0);
  }

  /**
   * override default method
   */
  transform (event, data) {

    if (event !== ACCESS_LOG_EVENT_NAME) {
      return data;
    }

    const log = JSON.parse(data);
    if (log.date) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('APPLICATION_LOG', (event) => ...)
   * @param {Function} fn which handle logs
   * @returns {this}
   */
  onLog (fn) {
    return this.on(ACCESS_LOG_EVENT_NAME, (event) => fn(event.data));
  }
}
