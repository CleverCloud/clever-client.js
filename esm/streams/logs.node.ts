import { EventSource } from 'eventsource';
import { AbstractLogsStream } from './logs.abstract.ts';

export class LogsStream extends AbstractLogsStream<EventSource> {
  protected _createEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
