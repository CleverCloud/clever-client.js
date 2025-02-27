import { AbstractLogsStream } from './logs.abstract.js';

/**
 * @extends AbstractLogsStream<EventSource>
 */
export class LogsStream extends AbstractLogsStream {

  /**
   * @param {string} url
   * @returns {EventSource}
   */
  _createEventSource (url) {
    return new window.EventSource(url);
  }
}
