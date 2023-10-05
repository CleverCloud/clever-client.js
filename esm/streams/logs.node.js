import EventSource from 'eventsource';
import { AbstractLogsStream } from './logs.abstract.js';

export class LogsStream extends AbstractLogsStream {

  createEventSource (url) {
    return new EventSource(url);
  }
}
