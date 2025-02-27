import CleverCloudSse from './clever-cloud-sse.js';

/**
 * @typedef {import('./resource-logs.types.js').ResourceLogsStreamParams} ResourceLogsStreamParams
 * @typedef {import('./resource-logs.types.js').ResourceLog} ResourceLog
 */

const RESOURCE_LOG_EVENT_NAME = 'RESOURCE_LOG';

/**
 * Clever Cloud Resource's logs stream
 */
export class ResourceLogStream extends CleverCloudSse {
  /**
   * @param {ResourceLogsStreamParams} params
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
   *
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
   * Transform the log event data to a resource log object.
   *
   * @param {string} event
   * @param {any} data
   * @returns {any}
   */
  transform (event, data) {
    if (event !== RESOURCE_LOG_EVENT_NAME) {
      return data;
    }

    /** @type {ResourceLog} */
    const log = JSON.parse(data);

    if (log.date) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('ACCESS_LOG', (event) => ...)
   *
   * @param {(log:ResourceLog) => void} fn which handle logs
   * @returns {this}
   */
  onLog (fn) {
    return this.on(RESOURCE_LOG_EVENT_NAME, (event) => {
      // @ts-ignore
      fn(event.data);
    });
  }
}
