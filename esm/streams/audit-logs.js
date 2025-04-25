import CleverCloudSse from './clever-cloud-sse.js';

/**
 * @typedef {import('./audit-logs.types.js').AuditLogsStreamParams} AuditLogsStreamParams
 * @typedef {import('./audit-logs.types.js').AuditLog} AuditLog
 */

const AUDIT_LOG_EVENT_NAME = 'AUDIT_LOG';

/**
 * CleverCloud Application's access logs stream
 */
export class AuditLogStream extends CleverCloudSse {
  /**
   * @param {AuditLogsStreamParams} params
   */
  constructor({ apiHost, tokens, ownerId, retryConfiguration, connectionTimeout, ...options }) {
    super(apiHost, tokens, retryConfiguration ?? {}, connectionTimeout);
    this._ownerId = ownerId;
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
  getUrl() {
    const url = this.buildUrl(`/v4/logs/organisations/${this._ownerId}/auditlogs`, {
      ...this._options,
      // in case of pause() then resume():
      // we don' t want N another logs, we want the initial passed number less the events count already received
      limit: this._computedLimit(),
    });

    return url;
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
    if (event !== AUDIT_LOG_EVENT_NAME) {
      return data;
    }

    /** @type {AuditLog} */
    const log = JSON.parse(data);
    if (log.date != null) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('AUDIT_LOG', (event) => ...)
   *
   * @param {(log:AuditLog) => void} fn which handle logs
   * @returns {this}
   */
  onLog(fn) {
    return this.on(AUDIT_LOG_EVENT_NAME, (event) => {
      // @ts-ignore
      fn(event.data);
    });
  }
}
