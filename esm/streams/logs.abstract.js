import { addOauthHeader } from '../oauth.js';
import { pickNonNull } from '../pick-non-null.js';
import { prefixUrl } from '../prefix-url.js';
import { fillUrlSearchParams } from '../utils/query-params.js';
import { AbstractStream, AuthenticationError } from './stream.abstract.js';

/**
 * @typedef {import('./logs.types.js').SseLike} SseLike
 * @typedef {import('../oauth.types.js').OAuthTokens} OAuthTokens
 */

const OPEN_TIMEOUT = 3000;

/**
 * @template {SseLike} T
 */
export class AbstractLogsStream extends AbstractStream {
  /**
   * @param {Object} options
   * @param {String} options.apiHost
   * @param {OAuthTokens} options.tokens
   * @param {String} options.appId
   * @param {String} [options.filter]
   * @param {String} [options.deploymentId]
   */
  constructor({ apiHost, tokens, appId, filter, deploymentId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.appId = appId;
    this.filter = filter;
    this.deploymentId = deploymentId;
  }

  // -- AbstractStream implementation ------

  /**
   * @returns {Promise<void>}
   * @protected
   */
  async _openSource() {
    // Prepare SSE auth => open connection => check min activity.
    // Then, wire source stream events to the system:
    // * tech events wired to _on*(): "message(ping)" => _onPing(), "error" => _onError()
    // * user events wired to event emitter: "message(log)" => "log"

    const { url } = await this._prepareLogsSse();
    this._sse = this._createEventSource(url);

    // Sometimes, the EventSource is open but no messages are returned and no errors thrown.
    // It's supposed to emit at least a first ping if everything is OK.
    // If we don't receive a message or an error within the duration OPEN_TIMEOUT,
    // we consider that the opening process failed, and we signal an OpenError.
    const openTimeoutId = setTimeout(() => {
      this._onError(new Error('Logs stream (SSE) was opened but nothing was received'));
    }, OPEN_TIMEOUT);

    // Wire SSE "message" to _onPing() call or "log" event
    this._sse.addEventListener('message', (message) => {
      clearTimeout(openTimeoutId);
      const parsedMessage = this._parseLogMessage(message);
      this._isPingMessage(parsedMessage)
        ? this._onPing(parsedMessage.heartbeat_delay_ms)
        : this.emit('log', parsedMessage);
    });

    // Wire SSE "error" to _onError() call
    this._sse.addEventListener('error', (error) => {
      clearTimeout(openTimeoutId);
      this._isAuthErrorMessage(error)
        ? this._onError(new AuthenticationError('Authentication for the logs stream (SSE) failed'))
        : this._onError(error);
    });
  }

  _closeSource() {
    // Closing is the same call for browser/node
    if (this._sse != null) {
      this._sse.close();
      this._sse = null;
    }
  }

  // -- abstract methods ------

  /**
   * @param {string} _url
   * @returns {T}
   * @abstract
   * @protected
   */
  _createEventSource(_url) {
    // It's up to the class extending AbstractLogsStream to implement how to create a SSE connection
    throw new Error('Not implemented');
  }

  // -- private methods ------

  /**
   * @param {any} message
   * @returns {any|null}
   */
  _parseLogMessage(message) {
    try {
      return JSON.parse(message.data);
    } catch {
      return null;
    }
  }

  /**
   * @param {any} err
   * @returns {boolean}
   */
  _isAuthErrorMessage(err) {
    return err != null && err.type === 'error' && err.status === 401;
  }

  /**
   * @returns {Promise<{url: string}>}
   * @private
   */
  _prepareLogsSse() {
    // To authenticate to the Server Sent Event endpoint, we use the oAuth v1 "Authorization" header,
    // we pass it as query param in the connexion URL (encoded as base64).
    // * URL used for signature is https://api.domain.tld/vX/logs/{appId}/see?foo=bar
    // * URL used for SSE connexion is https://api.domain.tld/vX/logs/{appId}/see?foo=bar&authorization=base64AuthHeader

    return Promise.resolve({
      method: 'get',
      url: `/v2/logs/${this.appId}/sse`,
      queryParams: pickNonNull(
        {
          filter: this.filter,
          // eslint-disable-next-line camelcase
          deployment_id: this.deploymentId,
        },
        ['filter', 'deployment_id'],
      ),
    })
      .then(prefixUrl(this.apiHost))
      .then(addOauthHeader(this.tokens))
      .then((requestParams) => {
        // prepare SSE URL's authorization query param
        const url = new URL(requestParams.url);
        fillUrlSearchParams(url, requestParams.queryParams);
        const base64AuthorizationHeader = globalThis.btoa(requestParams.headers.authorization);
        url.searchParams.set('authorization', base64AuthorizationHeader);
        return { url: url.toString() };
      });
  }
}
