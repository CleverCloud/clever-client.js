import { EventSource } from 'eventsource';
import { AbstractLogsStream } from './logs.abstract.js';

/**
 * @extends AbstractLogsStream<EventSource>
 */
export class LogsStream extends AbstractLogsStream {
  /**
   * @param {string} url
   * @returns {EventSource}
   * @protected
   */
  _createEventSource(url) {
    return new EventSource(url);
  }
}
