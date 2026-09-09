import { CcStream } from '../../../../lib/stream/cc-stream.js';
import type { CcStreamConfig, CcStreamRequestFactory } from '../../../../lib/stream/cc-stream.types.js';
import { CcApiStreamCommand } from '../../lib/cc-api-command.js';

/**
 * Base class for the commands that open a Server-Sent Events stream of log lines.
 *
 * Subclasses only have to name the SSE event carrying the logs and say how to turn its payload into a log
 * object. This class keeps track of how many lines were already delivered so that, when the stream is paused
 * and resumed or retried after an error, the reconnection asks for the remaining lines only rather than
 * replaying the ones the caller already saw.
 */
export abstract class AbstractLogsStreamCommand<
  CommandInput extends { limit?: number },
  Log,
> extends CcApiStreamCommand<CommandInput, LogsStream<Log>> {
  #logsCount = 0;

  createStream(requestFactory: CcStreamRequestFactory, config: CcStreamConfig): LogsStream<Log> {
    const logTopicName = this._logTopicName();
    const stream = new LogsStream<Log>(logTopicName, this._convertLog.bind(this), requestFactory, config);

    // Count the number of logs, so we can adapt the "limit" query param on pause/resume or error/retry
    this.#logsCount = 0;
    stream.on(logTopicName, () => {
      this.#logsCount++;
    });

    return stream;
  }

  /**
   * @abstract
   * @protected
   */
  abstract _logTopicName(): string;

  /**
   * @abstract
   * @protected
   */
  abstract _convertLog(_rawLog: unknown): Log;

  /**
   * @protected
   */
  _computeLimit(): null | number {
    return this.params.limit == null ? null : Math.max(this.params.limit - this.#logsCount, 0);
  }
}

/**
 * A Server-Sent Events stream of log lines, with the connection handling (heartbeat health check, retry with
 * exponential backoff, pause and resume) inherited from `CcStream`.
 */
export class LogsStream<Log> extends CcStream {
  #logTopicName: string;
  #logConverter: (payload: unknown) => Log | null;

  constructor(
    logTopicName: string,
    logConverter: (payload: unknown) => Log | null,
    requestFactory: CcStreamRequestFactory,
    config: CcStreamConfig,
  ) {
    super(requestFactory, config);
    this.#logTopicName = logTopicName;
    this.#logConverter = logConverter;
  }

  /**
   * Registers a callback invoked with each log line the stream delivers. Lines the converter cannot turn into
   * a log object are silently skipped.
   *
   * @param callback The function which handles the log
   */
  onLog(callback: (log: Log) => void): this {
    return this.on<string>(this.#logTopicName, (event) => {
      const log = this.#logConverter(JSON.parse(event.data));
      if (log != null) {
        callback(log);
      }
    });
  }
}
