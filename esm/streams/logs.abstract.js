import { AbstractStream, AuthenticationError } from './stream.abstract.js';
import { pickNonNull } from '../pick-non-null.js';
import { prefixUrl } from '../prefix-url.js';
import { addOauthHeader } from '../oauth.js';

const OPEN_TIMEOUT = 3000;

/**
 * @typedef {Object} OauthTokens
 * @prop {String} OAUTH_CONSUMER_KEY
 * @prop {String} OAUTH_CONSUMER_SECRET
 * @prop {String} API_OAUTH_TOKEN
 * @prop {String} API_OAUTH_TOKEN_SECRET
 */

export class AbstractLogsStream extends AbstractStream {

  /**
   * @param {Object} options
   * @param {String} options.apiHost
   * @param {OauthTokens} options.tokens
   * @param {String} options.appId
   * @param {String} [options.filter]
   * @param {String} [options.deploymentId]
   */
  constructor ({ apiHost, tokens, appId, filter, deploymentId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.appId = appId;
    this.filter = filter;
    this.deploymentId = deploymentId;
  }

  // To authenticate to the Server Sent Event endpoint, we use the oAuth v1 "Authorization" header,
  // we pass it as query param in the connexion URL (encoded as base64).
  // * URL used for signature is https://api.domain.tld/vX/logs/{appId}/see?foo=bar
  // * URL used for SSE connection is https://api.domain.tld/vX/logs/{appId}/see?foo=bar&authorization=base64AuthHeader
  prepareLogsSse () {
    return Promise
      .resolve({
        method: 'get',
        url: `/v2/logs/${this.appId}/sse`,
        queryParams: pickNonNull({
          filter: this.filter,
          deployment_id: this.deploymentId,
        }, ['filter', 'deployment_id']),
      })
      .then(prefixUrl(this.apiHost))
      .then(addOauthHeader(this.tokens))
      .then((requestParams) => {
        // prepare SSE URL's authorization query param
        const urlObject = new URL(requestParams.url);
        const qs = new URLSearchParams();
        Object.entries(requestParams.queryParams)
          .forEach(([name, value]) => qs.set(name, value));
        const base64AuthorizationHeader = globalThis.btoa(requestParams.headers.Authorization);
        qs.set('authorization', base64AuthorizationHeader);
        urlObject.search = qs.toString();
        const url = urlObject.toString();
        return { url };
      });
  }

  // Prepare SSE auth => open connection => check min activity.
  // Then, wire source stream events to the system:
  // * tech events wired to _on*(): "message(ping)" => _onPing(), "error" => _onError()
  // * user events wired to event emitter: "message(log)" => "log"
  async _openSource () {

    const { url } = await this.prepareLogsSse();
    this._sse = this.createEventSource(url);

    // Sometimes, the EventSource is open but no messages are returned and no errors thrown.
    // It's supposed to emit at least a first ping if everything is OK.
    // If we don't received a message or an error within the duration OPEN_TIMEOUT,
    // we consider that the opening process failed and we signal an OpenError.
    const openTimeoutId = setTimeout(() => {
      this._onError(new Error('Logs stream (SSE) was opened but nothing was received'));
    }, OPEN_TIMEOUT);

    // Wire SSE "message" to _onPing() call or "log" event
    this._sse.addEventListener('message', (message) => {
      clearTimeout(openTimeoutId);
      const parsedMessage = this.parseLogMessage(message);
      this.isPingMessage(parsedMessage)
        ? this._onPing(parsedMessage.heartbeat_delay_ms)
        : this.emit('log', parsedMessage);
    });

    // Wire SSE "error" to _onError() call
    this._sse.addEventListener('error', (error) => {
      clearTimeout(openTimeoutId);
      this.isAuthErrorMessage(error)
        ? this._onError(new AuthenticationError('Authentication for the logs stream (SSE) failed'))
        : this._onError(error);
    });
  }

  createEventSource () {
    // It's up to the class extending AbstractLogsStream to implement how to create a SSE connection
    throw new Error('Not implemented');
  }

  parseLogMessage (message) {
    try {
      return JSON.parse(message.data);
    }
    catch (e) {
      return null;
    }
  }

  isAuthErrorMessage (err) {
    return (err != null) && (err.type === 'error') && (err.status === 401);
  }

  // Closing is the same call for browser/node
  _closeSource () {
    if (this._sse != null) {
      this._sse.close();
      this._sse = null;
    }
  }
}
