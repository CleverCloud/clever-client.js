import CleverCloudSse from './clever-cloud-sse.js';

import type { ResourceLog, ResourceLogsStreamParams, ResourceLogStreamOptions } from './resource-logs.types.js';

const RESOURCE_LOG_EVENT_NAME = 'RESOURCE_LOG';

/**
 * Clever Cloud Resource's logs stream
 */
export class ResourceLogStream extends CleverCloudSse {
  private _ownerId: string;
  private _addonId: string;
  private _options: ResourceLogStreamOptions;
  private _logsCount: number;

  constructor({
    apiHost,
    tokens,
    ownerId,
    addonId,
    retryConfiguration,
    connectionTimeout,
    ...options
  }: ResourceLogsStreamParams) {
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
   */
  getUrl(): URL {
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
  private _computedLimit() {
    if (this._options.limit == null) {
      return undefined;
    }

    return Math.max(this._options.limit - this._logsCount, 0);
  }

  /**
   * Transform the log event data to a resource log object.
   */
  transform(event: string, data: any): any {
    if (event !== RESOURCE_LOG_EVENT_NAME) {
      return data;
    }

    const log: ResourceLog = JSON.parse(data);

    if (log.date) {
      log.date = new Date(log.date);
    }

    return log;
  }

  /**
   * shortcut for .on('ACCESS_LOG', (event) => ...)
   *
   * @param fn which handle logs
   */
  onLog(fn: (log: ResourceLog) => void): this {
    return this.on(RESOURCE_LOG_EVENT_NAME, (event) => {
      // @ts-expect-error event payload is dynamically typed by the underlying event target
      fn(event.data);
    });
  }
}
