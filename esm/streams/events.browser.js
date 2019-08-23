import { AbstractEventsStream } from './events.abstract.js';
import { addOauthHeader } from '../oauth.browser.js';

export class EventsStream extends AbstractEventsStream {

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createWebSocket (url) {
    return new window.WebSocket(url);
  }

  closeWebSocket (ws) {
    ws.close();
  }
}
