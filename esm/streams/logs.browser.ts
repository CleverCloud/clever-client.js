import { AbstractLogsStream } from './logs.abstract.js';

export class LogsStream extends AbstractLogsStream<EventSource> {
  protected _createEventSource(url: string): EventSource {
    return new window.EventSource(url);
  }
}
