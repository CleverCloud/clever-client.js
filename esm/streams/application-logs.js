import CleverCloudSse from './clever-cloud-sse.js';

/**
 * CleverCloud Application' logs stream
 */
export class ApplicationLogStream extends CleverCloudSse {
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
   * @param {string} options.deploymentId
   * @param {string} options.instanceId[]
   * @param {string} options.filter
   * @param {string} options.field[]
   * @param {number} options.throttleElements
   * @param {number} options.throttlePerInMilliseconds
   *
   */
  constructor ({ apiHost, tokens, ownerId, appId, retryConfiguration, ...options }) {
    super(apiHost, tokens, retryConfiguration ?? {});
    this.ownerId = ownerId;
    this.appId = appId;
    this.options = options;
  }

  /**
   * compute full URL with query params
   * @returns {string}
   */
  getUrl () {
    const url = this.buildUrl(
      `/v4/logs/organisations/${this.ownerId}/applications/${this.appId}/logs`,
      {
        ...this.options,
        // in case of pause() then resume():
        // we don' t want N another logs, we want the initial passed number less the events count already received
        limit: this._computedLimit(),
      },
    );

    return url;
  }

  // compute the number of events to retrieve, based on elements already received
  _computedLimit () {
    if (this.options.limit == null) {
      return null;
    }
    return Math.max(this.options.limit - this.eventCount, 0);
  }

  /**
   * override default method
   */
  transform (data) {
    if (data.date) {
      data.date = new Date(data.date);
    }

    return data;
  }

  /**
   * shortcut for .on('APPLICATION_LOG', (event) => ...)
   * @param {Function} fn which handle logs
   * @returns {any}
   */
  onLog (fn) {
    return this.on('APPLICATION_LOG', (event) => fn(event.data));
  }
}
