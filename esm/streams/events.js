import { addOauthHeader } from '../oauth.js';
import { prefixUrl } from '../prefix-url.js';
import { AbstractStream, AuthenticationError } from './stream.abstract.js';

/**
 * @typedef {import('./events.types.js').WebSocketLike} WebSocketLike
 * @typedef {import('../oauth.types.js').OAuthTokens} OAuthTokens
 */

const PONG_MESSAGE = JSON.stringify({
  type: 'heartbeat',
  // eslint-disable-next-line camelcase
  heartbeat_msg: 'pong',
});

/**
 * Base class to connect to the CleverCloud Event API using WebSocket.
 *
 * @abstract
 * @extends {AbstractStream}
 * @template {WebSocketLike} T
 */
export class EventsStream extends AbstractStream {
  /**
   * @param {Object} options
   * @param {String} options.apiHost
   * @param {OAuthTokens} options.tokens
   * @param {String} [options.appId]
   */
  constructor({ apiHost, tokens, appId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.appId = appId;
  }

  // -- AbstractStream implementation ------

  /**
   * @returns {Promise<void>}
   * @protected
   */
  async _openSource() {
    // Prepare WS auth => open connection =>
    // Then, wire source stream events to the system:
    // * tech events wired to _on*():
    //   * "message(ping)" => _onPing()
    //   * "message(authError)" => _onError()
    //   * "error" => _onError()
    //   * "close" => _onError()
    // * user events wired to event emitter: "message(event)" => "event"

    const { url, authMessage } = await this._prepareEventsWs();
    this._ws = new globalThis.WebSocket(url);

    this._ws.addEventListener('open', () => this._ws.send(authMessage));

    this._ws.addEventListener('message', (message) => {
      const parsedMessage = this._parseEventMessage(message);

      // Ignore socket_ready message
      if (this._isSocketReadyMessage(parsedMessage)) {
        return;
      }

      if (this._isPingMessage(parsedMessage)) {
        this._ws.send(PONG_MESSAGE);
        return this._onPing(parsedMessage.heartbeat_delay_ms);
      }

      if (this._isAuthErrorMessage(parsedMessage)) {
        return this._onError(new AuthenticationError('Authentication for the events stream (WS) failed'));
      }

      if (this.appId == null || this._matchesAppId(this.appId, parsedMessage)) {
        return this.emit('event', parsedMessage);
      }
    });

    this._ws.addEventListener('error', (error) => this._onError(error));

    // Save this listener so we can remove it easily in _closeSource
    this._wsCloseListener = /** @param {any} reason */ (reason) => {
      this._onError(new Error(`Events stream (WS) was closed reason:${JSON.stringify(reason)}`));
    };

    this._ws.addEventListener('close', this._wsCloseListener);
  }

  /**
   * @protected
   */
  _closeSource() {
    if (this._ws != null) {
      // When _closeSource() is called, we already know this._ws is about to be forced closed
      // so we need to remove the listener before calling closeWebSocket()
      this._ws.removeEventListener('close', this._wsCloseListener);
      this._ws.close();
    }
  }

  // -- private methods ------

  /**
   * @returns {Promise<{url: string, authMessage: string}>}
   */
  _prepareEventsWs() {
    // To authenticate to the WebSocket endpoint, we use the oAuth v1 "Authorization" header,
    // we pass it as message in the socket as JSON '{ "message_type": "oauth", "authorization": "Authorization Header ..." }'
    // * URL used for signature is https://api.domain.tld/vX/events
    // * URL used for WebSocket connection is wss://api.domain.tld/vX/events/event-socket
    return Promise.resolve({
      method: 'get',
      url: '/v2/events/',
    })
      .then(prefixUrl(this.apiHost))
      .then(addOauthHeader(this.tokens))
      .then((requestParams) => {
        // prepare WebSocket URL from URL used for signature
        const urlObj = new URL(requestParams.url);
        urlObj.protocol = 'wss:';
        urlObj.pathname = urlObj.pathname + 'event-socket';
        const url = urlObj.toString();
        // prepare message to auth WebSocket
        const authMessage = JSON.stringify({
          // eslint-disable-next-line camelcase
          message_type: 'oauth',
          authorization: requestParams.headers.authorization,
        });
        return { url, authMessage };
      });
  }

  /**
   * @param {any} message
   * @returns {any|null}
   * @private
   */
  _parseEventMessage(message) {
    try {
      const event = JSON.parse(message.data);
      const data = event.data != null ? JSON.parse(event.data) : null;
      return { ...event, data };
    } catch (_e) {
      return null;
    }
  }

  /**
   * @param {any} data
   * @returns {boolean}
   * @private
   */
  _isSocketReadyMessage(data) {
    return data != null && data.message_type === 'socket_ready';
  }

  /**
   * @param {any} err
   * @returns {boolean}
   * @private
   */
  _isAuthErrorMessage(err) {
    return err != null && err.type === 'error' && err.id === 2001;
  }

  /**
   * @param {string} appId
   * @param {any} event
   * @returns {boolean}
   * @private
   */
  _matchesAppId(appId, event) {
    if (event == null || event.data == null) {
      return false;
    }
    return event.data.id === appId || event.data.appId === appId;
  }
}
