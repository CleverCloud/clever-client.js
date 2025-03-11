import CleverCloudSse from './clever-cloud-sse.js';

/**
 * @typedef {import('./access-logs.types.js').ApplicationAccessLogsStreamParams} ApplicationAccessLogsStreamParams
 * @typedef {import('./access-logs.types.js').ApplicationAccessLog} ApplicationAccessLog
 */

const ACCESS_LOG_EVENT_NAME = 'ACCESS_LOG';

/**
 * CleverCloud Application's access logs stream
 */
export class ApplicationAccessLogStream extends CleverCloudSse {

  /**
   * @param {ApplicationAccessLogsStreamParams} params
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
   *
   * @returns {URL}
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
   * Transform the log event data to an application log object.
   *
   * @param {string} event
   * @param {any} data
   * @returns {any}
   */
  transform (event, data) {
    if (event !== ACCESS_LOG_EVENT_NAME) {
      return data;
    }

    /** @type {ApplicationAccessLog} */
    const log = JSON.parse(data);
    if (log.date != null) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('ACCESS_LOG', (event) => ...)
   *
   * @param {(log:ApplicationAccessLog) => void} fn which handle logs
   * @returns {this}
   */
  onLog (fn) {
    return this.on(ACCESS_LOG_EVENT_NAME, (event) => {
      // @ts-ignore
      fn(event.data);
    });
  }
}
