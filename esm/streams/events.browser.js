import { AbstractEventsStream } from './events.abstract.js';

export class EventsStream extends AbstractEventsStream {

  createWebSocket (url) {
    return new window.WebSocket(url);
  }

  closeWebSocket (ws) {
    ws.close();
  }
}
