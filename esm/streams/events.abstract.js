import { AbstractStream, AuthenticationError } from './stream.abstract.js';
import { prefixUrl } from '../prefix-url.js';

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

  addOauthHeader () {
    // It's up to the class extending AbstractEventsStream to implement how to sign and add an oAuthHeader
    throw new Error('Not implemented');
  }

  // Prepare WS auth => open connection =>
  // Then, wire source stream events to the system:
  // * tech events wired to _on*():
  //   * "message(ping)" => _onPing()
  //   * "message(authError)" => _onError()
  //   * "error" => _onError()
  //   * "close" => _onError()
  // * user events wired to event emitter: "message(event)" => "event"
  async _openSource () {

    const { url, authMessage } = await this.prepareEventsWs();
    this._ws = this.createWebSocket(url);

    this._ws.addEventListener('open', () => this._ws.send(authMessage));

    this._ws.addEventListener('message', (message) => {

      const parsedMessage = this.parseEventMessage(message);

      // Ignore socket_ready message
      if (this.isSocketReadyMessage(parsedMessage)) {
        return;
      }

      if (this.isPingMessage(parsedMessage)) {
        this._ws.send(PONG_MESSAGE);
        return this._onPing(parsedMessage.heartbeat_delay_ms);
      }

      if (this.isAuthErrorMessage(parsedMessage)) {
        return this._onError(new AuthenticationError('Authentication for the events stream (WS) failed'));
      }

      if (this.appId == null || this.matchesAppId(this.appId, parsedMessage)) {
        return this.emit('event', parsedMessage);
      }
    });

    this._ws.addEventListener('error', (error) => this._onError(error));

    // Save this listener so we can remove it easily in _close
    this._wsCloseListener = (reason) => {
      this._onError(new Error(`Events stream (WS) was closed reason:${JSON.stringify(reason)}`));
    };

    this._ws.addEventListener('close', this._wsCloseListener);
  }

  createWebSocket () {
    // It's up to the class extending AbstractEventsStream to implement how to create a WS connection
    throw new Error('Not implemented');
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

  _close () {
    if (this._ws != null) {
      // When _close() is called, we already know this._ws is about to be forced closed
      // so we need to remove the listner before calling closeWebSocket()
      this._ws.removeEventListener('close', this._wsCloseListener);
      this.closeWebSocket(this._ws);
    }
  }

  closeWebSocket () {
    // It's up to the class extending AbstractEventsStream to implement how to close a WS connection
    throw new Error('Not implemented');
  }
}
