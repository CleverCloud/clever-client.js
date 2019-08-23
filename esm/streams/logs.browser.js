import { AbstractLogsStream } from './logs.abstract.js';
import { addOauthHeader } from '../oauth.browser.js';

const btoa = (str) => window.btoa(str);

export class LogsStream extends AbstractLogsStream {

  btoa (str) {
    return window.btoa(str);
  }

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createEventSource (url) {
    return new window.EventSource(url);
  }
}
