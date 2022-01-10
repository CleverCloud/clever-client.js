import { AbstractStream, AuthenticationError } from './stream.abstract.js';
import { prefixUrl } from '../prefix-url.js';
const networkgroup = require('../../cjs/api/v4/networkgroup.js');

const OPEN_TIMEOUT = 3000;

/**
 * @typedef {Object} OauthTokens
 * @prop {String} OAUTH_CONSUMER_KEY
 * @prop {String} OAUTH_CONSUMER_SECRET
 * @prop {String} API_OAUTH_TOKEN
 * @prop {String} API_OAUTH_TOKEN_SECRET
 */
export class AbstractNetworkgroupStream extends AbstractStream {

  /**
   * @param {Object} options
   * @param {String} options.apiHost
   * @param {OauthTokens} options.tokens
   * @param {String} options.ownerId
   * @param {String} options.ngId
   * @param {String} options.peerId
   */
  constructor ({ apiHost, tokens, ownerId, ngId, peerId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.ownerId = ownerId;
    this.ngId = ngId;
    this.peerId = peerId;
  }

  /**
   * To authenticate to the Server Sent Event endpoint, we use the `oAuth v1` `"Authorization"` header,
   * we pass it as query param in the connexion URL (encoded as `base64`).
   * * `URL` used for signature is https://api.domain.tld/vX/peers/{peerId}/wireguard/configuration/stream?foo=bar
   * * `URL` used for SSE connection is https://api.domain.tld/vX/peers/{peerId}/wireguard/configuration/stream?foo=bar&authorization=base64AuthHeader
   */
  prepareWireguardConfigurationSse () {
    return networkgroup.sseWgConf({ ownerId: this.ownerId, ngId: this.ngId, peerId: this.peerId })
      .then(prefixUrl(this.apiHost))
      .then(this.addOauthHeader(this.tokens))
      .then((requestParams) => {
        // Prepare SSE URL's authorization query param
        const urlObject = new URL(requestParams.url);

        // Add Authorization
        const qs = new URLSearchParams();
        const base64AuthorizationHeader = this.btoa(requestParams.headers.Authorization);
        qs.set('authorization', base64AuthorizationHeader);
        urlObject.search = qs.toString();

        // Build URL
        const url = urlObject.toString();
        return { url };
      });
  }

  addOauthHeader () {
    throw new Error('Not implemented. It\'s up to the class extending `AbstractNetworkgroupStream` to implement how to sign and add an `oAuthHeader`.');
  }

  atob () {
    throw new Error('Not implemented. It\'s up to the class extending `AbstractNetworkgroupStream` to implement how to do `base64` decoding.');
  }

  btoa () {
    throw new Error('Not implemented. It\'s up to the class extending `AbstractNetworkgroupStream` to implement how to do `base64` encoding.');
  }

  /**
   * Prepare SSE auth => open connection => check min activity.
   * Then, wire source stream events to the system:
   * * Tech events wired to `_on*()`:
   *   * `"message(ping)"` => `_onPing()`
   *   * `"error"(error)` => `_onError()`
   * * User events wired to event emitter:
   *   * `"message(conf)"` => `"conf"`
   */
  async _openSource () {
    const { url } = await this.prepareWireguardConfigurationSse();
    this._sse = this.createEventSource(url);

    // Sometimes, the EventSource is open but no messages are returned and no errors thrown.
    // It's supposed to emit at least a first ping if everything is OK.
    // If we don't received a message or an error within the duration `OPEN_TIMEOUT`,
    // we consider that the opening process failed and we signal an `OpenError`.
    const openTimeoutId = setTimeout(() => {
      this._onError(new Error('Networkgroup configuration stream (SSE) was opened but nothing was received'));
    }, OPEN_TIMEOUT);

    // Wire SSE `'message'` to `_onPing()` call or `'conf'` event
    this._sse.addEventListener('message', (message) => {
      clearTimeout(openTimeoutId);

      const parsedMessage = this.parseMessage(message);
      if (this.isPingMessage(parsedMessage)) {
        this._onPing(parsedMessage.heartbeat_delay_ms);
      }
      else {
        const conf = this.parseConfMessage(message);
        if (conf != null) {
          this.emit('conf', conf);
        }
      }
    });

    // Wire SSE `'error'` to `_onError()` call
    this._sse.addEventListener('error', (error) => {
      clearTimeout(openTimeoutId);
      this.isAuthErrorMessage(error)
        ? this._onError(new AuthenticationError('Authentication for the networkgroup configuration stream (SSE) failed'))
        : this._onError(error);
    });
  }

  createEventSource () {
    throw new Error('Not implemented. It\'s up to the class extending `AbstractNetworkgroupStream` to implement how to create a SSE connection.');
  }

  parseMessage (message) {
    try {
      return JSON.parse(message.data);
    }
    catch (e) {
      return null;
    }
  }

  parseConfMessage (message) {
    try {
      const object = JSON.parse(message.data);
      if (object == null || !object.keys().includes(['ng-id', 'peer-id', 'version', 'configuration'])) {
        return null;
      }
      return {
        ngId: object['ng-id'],
        peerId: object['peer-id'],
        version: object.version,
        configuration: this.atob(object.configuration),
      };
    }
    catch (e) {
      return null;
    }
  }

  isAuthErrorMessage (err) {
    return (err != null)
        && (err.type === 'error')
        && (err.status === 401);
  }

  /**
   * Closing is the same call for browser/node.
   */
  _close () {
    if (this._sse != null) {
      this._sse.close();
      this._sse = null;
    }
  }

}
