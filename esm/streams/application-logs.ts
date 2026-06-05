import CleverCloudSse from './clever-cloud-sse.js';

import type {
  ApplicationLog,
  ApplicationLogsStreamParams,
  ApplicationLogStreamOptions,
} from './application-logs.types.js';

const APPLICATION_LOG_EVENT_NAME = 'APPLICATION_LOG';

/**
 * CleverCloud Applications' logs stream
 */
export class ApplicationLogStream extends CleverCloudSse {
  private _ownerId: string;
  private _appId: string;
  private _options: ApplicationLogStreamOptions;
  private _logsCount: number;

  constructor({
    apiHost,
    tokens,
    ownerId,
    appId,
    retryConfiguration,
    connectionTimeout,
    ...options
  }: ApplicationLogsStreamParams) {
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
    return this.buildUrl(`/v4/logs/organisations/${this._ownerId}/applications/${this._appId}/logs`, {
      ...this._options,
      // in case of pause() then resume():
      // we don't want N another logs, we want the initial passed number less the events count already received
      limit: this._computedLimit(),
    });
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
    if (event !== APPLICATION_LOG_EVENT_NAME) {
      return data;
    }

    const log: ApplicationLog = JSON.parse(data);
    if (log.date != null) {
      log.date = new Date(log.date);
    }
    return log;
  }

  /**
   * shortcut for .on('APPLICATION_LOG', (event) => ...)
   *
   * @param fn The function which handle log
   */
  onLog(fn: (log: ApplicationLog) => void): this {
    return this.on(APPLICATION_LOG_EVENT_NAME, (event) => {
      // @ts-expect-error event payload is dynamically typed by the underlying event target
      return fn(event.data);
    });
  }
}
