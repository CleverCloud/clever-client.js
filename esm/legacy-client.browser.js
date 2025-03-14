// @ts-nocheck
import Bacon from 'baconjs';
import { initLegacyClient } from './api/v2/legacy-client.js';
import { addOauthHeader } from './oauth.js';
import { prefixUrl } from './prefix-url.js';
import { request } from './request.fetch.js';
import { sendLegacyRequest } from './send-legacy-request.js';

/**
 * @param {Object} config - configuration object
 * @param {Function} onError - function to handle API errors
 * @returns {Promise}
 */
export function initCleverClient(config, onError) {
  const legacyClient = initLegacyClient((clientFn, pathParamNames = []) => {
    return () =>
      sendLegacyRequest((req, body) => {
        const params = { ...req.query };
        pathParamNames.forEach((paramName, i) => {
          params[paramName] = req.params[i];
        });

        const restCallPromise = clientFn(params, body)
          .then((requestParams) => {
            return {
              ...requestParams,
              headers: {
                ...requestParams.headers,
                ...req.headers,
              },
            };
          })
          .then(prefixUrl(config.API_HOST))
          .then(addOauthHeader(config))
          .then(request)
          .catch((error) => {
            if (onError != null) {
              return onError(error);
            }
            throw error;
          });

        return Bacon.fromPromise(restCallPromise);
      });
  });

  // add special "owner" helper function
  legacyClient.owner = function (ownerId) {
    return ownerId != null && ownerId.includes('orga_') ? legacyClient.organisations._ : legacyClient.self;
  };

  return legacyClient;
}
