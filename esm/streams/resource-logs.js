import CleverCloudSse from './clever-cloud-sse.js';

const RESOURCE_LOG_EVENT_NAME = 'RESOURCE_LOG';

export class ResourceLogStream extends CleverCloudSse {
  /**
   * @param {object} options
   * @param {string} options.apiHost
   * @param {object} options.tokens
   * @param {string} options.tokens.OAUTH_CONSUMER_KEY
   * @param {string} options.tokens.OAUTH_CONSUMER_SECRET
   * @param {string} options.tokens.API_OAUTH_TOKEN
   * @param {string} options.tokens.API_OAUTH_TOKEN_SECRET
   * @param {string} options.ownerId
   * @param {string} options.addonId
   * @param {number} options.connectionTimeout
   * @param {object} options.retryConfiguration
   * @param {boolean} options.retryConfiguration.enabled
   * @param {number} options.retryConfiguration.backoffFactor
   * @param {number} options.retryConfiguration.initRetryTimeout
   * @param {number} options.retryConfiguration.maxRetryCount
   * @param {Date} options.since
   * @param {Date} options.until
   * @param {number} options.limit
   * @param {string} options.filter
   * @param {string} options.field[]
   * @param {number} options.throttleElements
   * @param {number} options.throttlePerInMilliseconds
   */
  constructor ({ apiHost, tokens, ownerId, addonId, retryConfiguration, connectionTimeout, ...options }) {
    super(apiHost, tokens, retryConfiguration ?? {}, connectionTimeout);
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._options = options;
    this._logsCount = 0;
    this.onLog(() => {
      this._logsCount++;
    });
  }

  /**
   * compute full URL with query params
   * @returns {URL}
   */
  getUrl () {
    return this.buildUrl(`/v4/logs/organisations/${this._ownerId}/resources/${this._addonId}/logs`, {
      ...this._options,
      // in case of pause() then resume():
      // we don' t want N another logs, we want the initial passed number less the events count already received
      limit: this._computedLimit(),
    });
  }

  /**
   * compute the number of events to retrieve, based on elements already received
   */
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
    if (event !== RESOURCE_LOG_EVENT_NAME) {
      return data;
    }

    const log = JSON.parse(data);

    if (log.date) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * catch Log messages from stream
   * @param {logCallback} fn callback which handle logs
   * @returns {this}
   */
  onLog (fn) {
    return this.on(RESOURCE_LOG_EVENT_NAME, (event) => fn(event.data));
  }

/**
 * This callback handle a Log.
 * @callback logCallback
 * @param {object} log
 * @param {Date}   log.date
 * @param {string} log.hostname
 * @param {string} log.id
 * @param {string} log.instanceId
 * @param {string} log.message
 * @param {string} log.region
 * @param {string} log.resourceId
 * @param {string} log.service
 * @param {string} log.severity
 * @param {string} log.zone
 */
}
