import { AbstractStream, AUTHENTICATION_REASON } from './stream.abstract.js';
import { pickNonNull } from '../pick-non-null.js';
import { prefixUrl } from '../prefix-url.js';

const OPEN_TIMEOUT = 3000;

export class AbstractLogsStream extends AbstractStream {

  constructor ({ apiHost, tokens, appId, filter, deploymentId }) {
    super();
    this.apiHost = apiHost;
    this.tokens = tokens;
    this.appId = appId;
    this.filter = filter;
    this.deploymentId = deploymentId;
  }

  // btoa, addOauthHeader and createEventSource don't have the same implementation (browsers/node)

  btoa () {
    throw new Error('Not implemented');
  }

  addOauthHeader () {
    throw new Error('Not implemented');
  }

  createEventSource () {
    throw new Error('Not implemented');
  }

  // To authenticate to the Server Sent Event endpoint, we use the oAuth v1 "Authorization" header,
  // we pass it as query param in the connexion URL (encoded as base64).
  // * URL used for signature is https://api.domain.tld/vX/logs/{appId}/see?foo=bar
  // * URL used for SSE connection is https://api.domain.tld/vX/logs/{appId}/see?foo=bar&authorization=base64AuthHeader
  prepareLogsSse () {
    return Promise
      .resolve({
        method: 'get',
        url: `/logs/${this.appId}/sse`,
        queryParams: pickNonNull({
          filter: this.filter,
          'deployment_id': this.deploymentId,
        }, ['filter', 'deployment_id']),
      })
      .then(prefixUrl(this.apiHost))
      .then(this.addOauthHeader(this.tokens))
      .then((requestParams) => {
        // prepare SSE URL's authorization query param
        const urlObject = new URL(requestParams.url);
        const qs = new URLSearchParams();
        Object.entries(requestParams.queryParams)
          .forEach(([name, value]) => qs.set(name, value));
        const base64AuthorizationHeader = this.btoa(requestParams.headers.Authorization);
        qs.set('authorization', base64AuthorizationHeader);
        urlObject.search = qs.toString();
        const url = urlObject.toString();
        return { url };
      });
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

  async openStream ({ onMessage, onPing, onClose }) {

    const { url } = await this.prepareLogsSse();
    const sse = this.createEventSource(url);

    // Sometimes, the EventSource is open but no messages are returned and no errors thrown
    // We wait for OPEN_TIMEOUT before considering the EventSource
    // if no message or error is received by then, we close the stream
    const openTimeoutId = setTimeout(doClose, OPEN_TIMEOUT);

    function doClose (reason) {
      sse.close();
      onClose(reason);
    }

    sse.addEventListener('message', (message) => {
      clearTimeout(openTimeoutId);
      const parsedMessage = this.parseLogMessage(message);
      this.isPingMessage(parsedMessage)
        ? onPing(parsedMessage.heartbeat_delay_ms)
        : onMessage(parsedMessage);
    });

    sse.addEventListener('error', (err) => {
      clearTimeout(openTimeoutId);
      this.isAuthErrorMessage(err)
        ? doClose(AUTHENTICATION_REASON)
        : doClose();
    });

    return doClose;
  };
}
