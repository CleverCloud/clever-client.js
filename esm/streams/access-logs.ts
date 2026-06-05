import CleverCloudSse from './clever-cloud-sse.js';

import type {
  ApplicationAccessLog,
  ApplicationAccessLogsStreamParams,
  ApplicationAccessLogStreamOptions,
} from './access-logs.types.js';

const ACCESS_LOG_EVENT_NAME = 'ACCESS_LOG';

/**
 * CleverCloud Application's access logs stream
 */
export class ApplicationAccessLogStream extends CleverCloudSse {
  private _ownerId: string;
  private _appId: string;
  private _options: ApplicationAccessLogStreamOptions;
  private _logsCount: number;

  constructor({
    apiHost,
    tokens,
    ownerId,
    appId,
    retryConfiguration,
    connectionTimeout,
    ...options
  }: ApplicationAccessLogsStreamParams) {
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
   */
  getUrl(): URL {
    const url = this.buildUrl(`/v4/accesslogs/organisations/${this._ownerId}/applications/${this._appId}/accesslogs`, {
      ...this._options,
      // in case of pause() then resume():
      // we don' t want N another logs, we want the initial passed number less the events count already received
      limit: this._computedLimit(),
    });

    return url;
  }

  // compute the number of events to retrieve, based on elements already received
  private _computedLimit() {
    if (this._options.limit == null) {
      return undefined;
    }
    return Math.max(this._options.limit - this._logsCount, 0);
  }

  /**
   * Transform the log event data to an application log object.
   */
  transform(event: string, data: any): any {
    if (event !== ACCESS_LOG_EVENT_NAME) {
      return data;
    }

    const log: ApplicationAccessLog = JSON.parse(data);
    if (log.date != null) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('ACCESS_LOG', (event) => ...)
   *
   * @param fn which handle logs
   */
  onLog(fn: (log: ApplicationAccessLog) => void): this {
    return this.on(ACCESS_LOG_EVENT_NAME, (event) => {
      // @ts-expect-error event payload is dynamically typed by the underlying event target
      fn(event.data);
    });
  }
}
