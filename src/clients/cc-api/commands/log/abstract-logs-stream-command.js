/**
 * @import { CcStreamRequestFactory, CcStreamConfig } from '../../../../lib/stream/cc-stream.types.js'
 */
import { CcStream } from '../../../../lib/stream/cc-stream.js';
import { CcApiStreamCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiStreamCommand<CommandInput, LogsStream<Log>>}
 * @template {{limit?: number}} CommandInput
 * @template Log
 */
export class AbstractLogsStreamCommand extends CcApiStreamCommand {
  /** @type {number} */
  #logsCount = 0;

  /** @type {CcApiStreamCommand<CommandInput, LogsStream<Log>>['createStream']} */
  createStream(requestFactory, config) {
    const logTopicName = this._logTopicName();
    const stream = new LogsStream(logTopicName, this._convertLog.bind(this), requestFactory, config);

    // Count the number of logs, so we can adapt the "limit" query param on pause/resume or error/retry
    this.#logsCount = 0;
    stream.on(logTopicName, () => {
      this.#logsCount++;
    });

    return stream;
  }

  /**
   * @returns {string}
   * @abstract
   * @protected
   */
  _logTopicName() {
    throw new Error('Not implemented');
  }

  /**
   * @param {any} _rawLog
   * @returns {Log}
   * @abstract
   * @protected
   */
  _convertLog(_rawLog) {
    throw new Error('Not implemented');
  }

  /**
   * @return {null|number}
   * @protected
   */
  _computeLimit() {
    return this.params.limit == null ? null : Math.max(this.params.limit - this.#logsCount, 0);
  }
}

/**
 * @template Log
 */
export class LogsStream extends CcStream {
  /** @type {string} */
  #logTopicName;
  /** @type {(payload: any) => Log|null} */
  #logConverter;

  /**
   * @param {string} logTopicName
   * @param {(payload: any) => Log|null} logConverter
   * @param {CcStreamRequestFactory} requestFactory
   * @param {CcStreamConfig} config
   */
  constructor(logTopicName, logConverter, requestFactory, config) {
    super(requestFactory, config);
    this.#logTopicName = logTopicName;
    this.#logConverter = logConverter;
  }

  /**
   * @param {(log: Log) => void} callback The function which handles the log
   * @returns {this}
   */
  onLog(callback) {
    return this.on(this.#logTopicName, (event) => {
      const log = this.#logConverter(JSON.parse(event.data));
      if (log != null) {
        callback(log);
      }
    });
  }
}
