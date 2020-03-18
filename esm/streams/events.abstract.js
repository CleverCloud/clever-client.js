import { AbstractStream, AUTHENTICATION_REASON } from './stream.abstract.js';
import { prefixUrl } from '../prefix-url';

const PONG_MESSAGE = JSON.stringify({
  type: 'heartbeat',
  heartbeat_msg: 'pong',
});

export class AbstractEventsStream extends AbstractStream {

  constructor ({ apiHost, tokens, appId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.appId = appId;
  }

  // addOauthHeader, createWebSocket and closeWebSocket don't have the same implementation (browsers/node)

  addOauthHeader () {
    throw new Error('Not implemented');
  }

  createWebSocket () {
    throw new Error('Not implemented');
  }

  closeWebSocket () {
    throw new Error('Not implemented');
  }

  // To authenticate to the WebSocket endpoint, we use the oAuth v1 "Authorization" header,
  // we pass it as message in the socket as JSON '{ "message_type": "oauth", "authorization": "Authorization Header ..." }'
  // * URL used for signature is https://api.domain.tld/vX/events
  // * URL used for WebSocket connection is wss://api.domain.tld/vX/events/event-socket
  prepareEventsWs () {
    return Promise
      .resolve({
        method: 'get',
        url: '/events/',
      })
      .then(prefixUrl(this.apiHost))
      .then(this.addOauthHeader(this.tokens))
      .then((requestParams) => {
        // prepare WebSocket URL from URL used for signature
        const urlObj = new URL(requestParams.url);
        urlObj.protocol = 'wss:';
        urlObj.pathname = urlObj.pathname + 'event-socket';
        const url = urlObj.toString();
        // prepare message to auth WebSocket
        const authMessage = JSON.stringify({
          message_type: 'oauth',
          authorization: requestParams.headers.Authorization,
        });
        return { url, authMessage };
      });
  }

  parseEventMessage (message) {
    try {
      const event = JSON.parse(message.data);
      const data = (event.data != null)
        ? JSON.parse(event.data)
        : null;
      return { ...event, data };
    }
    catch (e) {
      return null;
    }
  }

  isSocketReadyMessage (data) {
    return (data != null) && (data.message_type === 'socket_ready');
  }

  isAuthErrorMessage (err) {
    return (err != null) && (err.type === 'error') && (err.id === 2001);
  }

  matchesAppId (appId, event) {
    if (event == null || event.data == null) {
      return false;
    }
    return (event.data.id === appId || event.data.appId === appId);
  }

  async openStream ({ onMessage, onPing, onClose }) {

    const { url, authMessage } = await this.prepareEventsWs();

    const ws = this.createWebSocket(url);

    const doClose = (reason) => {
      // prevent the ws.close() to trigger an onClose without reason
      ws.removeEventListener('close', onClose);
      this.closeWebSocket(ws);
      onClose(reason);
    };

    ws.addEventListener('open', () => ws.send(authMessage));

    ws.addEventListener('message', (message) => {

      const parsedMessage = this.parseEventMessage(message);

      // Ignore socket_ready message
      if (this.isSocketReadyMessage(parsedMessage)) {
        return;
      }

      if (this.isPingMessage(parsedMessage)) {
        ws.send(PONG_MESSAGE);
        return onPing(parsedMessage.heartbeat_delay_ms);
      }

      if (this.isAuthErrorMessage(parsedMessage)) {
        return doClose(AUTHENTICATION_REASON);
      }

      if (this.appId == null || this.matchesAppId(this.appId, parsedMessage)) {
        return onMessage(parsedMessage);
      }
    });

    // We need to listen to errors for node
    ws.addEventListener('error', () => {
    });

    ws.addEventListener('close', onClose);

    return doClose;
  };
}
