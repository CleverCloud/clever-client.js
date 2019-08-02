import { addOauthHeader } from './oauth.browser.js';
import { pickNonNull } from './pick-non-null.js';
import { prefixUrl } from './prefix-url.js';

const btoa = window.btoa;

// To authenticate to the Server Sent Event, we use the oAuth v1 "Authorization" header,
// we pass it as query param in the connexion URL (encoded as base64).
// * URL used for signature is https://api.domain.tld/vX/logs/{appId}/see?foo=bar
// * URL used for SSE connexion is https://api.domain.tld/vX/logs/{appId}/see?foo=bar&authorization=base64AuthHeader
export function prepareLogsSse ({ apiHost, tokens, appId, filter, deploymentId }) {

  return Promise
    .resolve({
      method: 'get',
      url: `/logs/${appId}/sse`,
      queryParams: pickNonNull({ filter, 'deployment_id': deploymentId }, ['filter', 'deployment_id']),
    })
    .then(prefixUrl(apiHost))
    .then(addOauthHeader(tokens))
    .then((requestParams) => {
      // prepare SSE URL's authorization query param
      const urlObject = new URL(requestParams.url);
      const qs = new URLSearchParams();
      Object.entries(requestParams.queryParams)
        .forEach(([name, value]) => qs.set(name, value));
      const base64AuthorizationHeader = btoa(requestParams.headers.Authorization);
      qs.set('authorization', base64AuthorizationHeader);
      urlObject.search = qs.toString();
      const url = urlObject.toString();
      return { url };
    });
}

// To authenticate to the WebSocket, we use the oAuth v1 "Authorization" header,
// we pass it as the first message once the connexion is open.
// * URL used for signature is https://api.domain.tld/vX/events
// * URL used for WebSocket connexion is wss://api.domain.tld/vX/events/event-socket
export function prepareEventsWs ({ apiHost, tokens, intervalDelay = 40000 }) {
  let intervalId;
  const startPing = (sendPing) => {
    intervalId = setInterval(() => sendPing('["ping"]'), intervalDelay);
  };
  const stopPing = () => clearInterval(intervalId);
  return Promise
    .resolve({
      method: 'get',
      url: `/events/`,
    })
    .then(prefixUrl(apiHost))
    .then(addOauthHeader(tokens))
    .then((requestParams) => {
      // prepare WebSocket URL from URL used for signature
      const urlObj = new URL(requestParams.url);
      urlObj.protocol = 'wss:';
      urlObj.pathname = urlObj.pathname + 'event-socket';
      const url = urlObj.toString();
      // prepare message to auth WebSocket
      const authMessage = JSON.stringify({
        'message_type': 'oauth',
        authorization: requestParams.headers.Authorization,
      });
      return { url, authMessage, startPing, stopPing };
    });
}
