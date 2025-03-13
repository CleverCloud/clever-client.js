import { AbstractEventsStream } from './events.abstract.js';

/**
 * @extends {AbstractEventsStream<WebSocket>}
 */
export class EventsStream extends AbstractEventsStream {
  /**
   * @param {string} url
   * @returns {WebSocket}
   * @protected
   */
  _createWebSocket(url) {
    return new window.WebSocket(url);
  }

  /**
   * @param {WebSocket} ws
   * @protected
   */
  _closeWebSocket(ws) {
    ws.close();
  }
}
