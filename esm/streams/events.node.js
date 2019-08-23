import WebSocket from 'ws';
import { AbstractEventsStream } from './events.abstract.js';
import { addOauthHeader } from '../oauth.node.js';

export class EventsStream extends AbstractEventsStream {

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createWebSocket (url) {
    return new WebSocket(url);
  }

  closeWebSocket (ws) {
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    ws.terminate();
  }
}
