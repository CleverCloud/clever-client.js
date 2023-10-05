import WebSocket from 'ws';
import { AbstractEventsStream } from './events.abstract.js';

export class EventsStream extends AbstractEventsStream {

  createWebSocket (url) {
    return new WebSocket(url);
  }

  closeWebSocket (ws) {
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    ws.terminate();
  }
}
