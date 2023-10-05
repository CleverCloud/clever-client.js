import CleverCloudSse from './clever-cloud-sse.js';

/**
 * CleverCloud Application' logs stream
 */
export class ApplicationLogStream extends CleverCloudSse {
  /**
   * @param {string} apiHost
   * @param {string} tokens
   * @param {string} organizationId
   * @param {string} applicationId
   * @param {string} options
   */
  constructor ({ apiHost, tokens, ownerId, appId, ...options }) {
    super(apiHost, tokens);

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
}
