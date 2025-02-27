import WebSocket from 'ws';
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
  _createWebSocket (url) {
    return new WebSocket(url);
  }

  /**
   * @param {WebSocket} webSocket
   * @protected
   */
  _closeWebSocket (webSocket) {
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    webSocket.terminate();
  }
}
