import Bacon from 'baconjs';
import { addOauthHeader } from './oauth.node.js';
import { sendLegacyRequest } from './send-legacy-request.js';
import { initLegacyClient } from './api/legacy-client.js';
import { prefixUrl } from './prefix-url.js';
import { request } from './request.superagent.js';

export function initCleverClient (config) {

  const legacyClient = initLegacyClient((clientFn, pathParamNames = []) => {

    return () => sendLegacyRequest((req, body) => {

      const params = { ...req.query };
      pathParamNames.forEach((paramName, i) => {
        params[paramName] = req.params[i];
      });

      const restCallPromise = clientFn(params, body)
        .then(prefixUrl(config.API_HOST))
        .then(addOauthHeader(config))
        .then(request);

      return Bacon.fromPromise(restCallPromise);
    });
  });

  // add special "owner" helper function
  legacyClient.owner = function (ownerId) {
    return ownerId != null && ownerId.includes('orga_') ? legacyClient.organisations._ : legacyClient.self;
  };

  // add session.getHMACAuthorization(httpMethod, url, params, tokens)
  // so CLI can use that to sign calls to WS (events, logs, notifs...)
  legacyClient.session = {
    getHMACAuthorization (method, url, queryParams, tokens) {

      if (!tokens.user_oauth_token || !tokens.user_oauth_token_secret) {
        return '';
      }

      const requestParams = { method, url, queryParams };
      const { headers } = addOauthHeader(config)(requestParams);

      return headers.Authorization;
    },
  };

  return legacyClient;
}
