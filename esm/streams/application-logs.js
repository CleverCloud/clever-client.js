import CleverCloudSse from './clever-cloud-sse.js';

/**
 * @typedef {import('./application-logs.types.js').ApplicationLogsStreamParams} ApplicationLogsStreamParams
 * @typedef {import('./application-logs.types.js').ApplicationLog} ApplicationLog
 */

const APPLICATION_LOG_EVENT_NAME = 'APPLICATION_LOG';

/**
 * CleverCloud Applications' logs stream
 */
export class ApplicationLogStream extends CleverCloudSse {
  /**
   * @param {ApplicationLogsStreamParams} params
   */
  constructor({ apiHost, tokens, ownerId, appId, retryConfiguration, connectionTimeout, ...options }) {
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
   * @returns {URL}
   */
  getUrl() {
    return this.buildUrl(`/v4/logs/organisations/${this._ownerId}/applications/${this._appId}/logs`, {
      ...this._options,
      // in case of pause() then resume():
      // we don't want N another logs, we want the initial passed number less the events count already received
      limit: this._computedLimit(),
    });
  }

  // compute the number of events to retrieve, based on elements already received
  _computedLimit() {
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
  transform(event, data) {
    if (event !== APPLICATION_LOG_EVENT_NAME) {
      return data;
    }

    /** @type {ApplicationLog} */
    const log = JSON.parse(data);
    if (log.date != null) {
      log.date = new Date(log.date);
    }
    return log;
  }

  /**
   * shortcut for .on('APPLICATION_LOG', (event) => ...)
   *
   * @param {(log: ApplicationLog) => void} fn The function which handle log
   * @returns {this}
   */
  onLog(fn) {
    return this.on(APPLICATION_LOG_EVENT_NAME, (event) => {
      // @ts-ignore
      return fn(event.data);
    });
  }
}
