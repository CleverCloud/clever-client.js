import EventSource from 'eventsource';
import { AbstractLogsStream } from './logs.abstract.js';
import { addOauthHeader } from '../oauth.node.js';

const btoa = (str) => Buffer.from(str).toString('base64');

export class LogsStream extends AbstractLogsStream {

  btoa (str) {
    return Buffer.from(str).toString('base64');
  }

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createEventSource (url) {
    return new EventSource(url);
  }
}
