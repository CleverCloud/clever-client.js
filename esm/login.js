import { fetchAccessToken as doFetchAccessToken, fetchRequestToken as doFetchRequestToken } from './api/v2/oauth.js';

/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {object} _
 * @param {string} _.consumerKey
 * @param {string} _.consumerSecret
 * @param {string} [_.tokenSecret]
 * @returns {{oauth_consumer_key: string, oauth_signature_method: string, oauth_signature: string}}
 */
export function getOauthParams({ consumerKey, consumerSecret, tokenSecret = '' }) {
  return {
    // eslint-disable-next-line camelcase
    oauth_consumer_key: consumerKey,
    // eslint-disable-next-line camelcase
    oauth_signature_method: 'PLAINTEXT',
    // eslint-disable-next-line camelcase
    oauth_signature: consumerSecret + '&' + tokenSecret,
  };
}

/**
 * @param {object} _
 * @param {string} _.consumerKey
 * @param {string} _.consumerSecret
 * @param {string} _.oauthCallback
 * @returns {Promise<RequestParams>}
 */
export function fetchRequestToken({ consumerKey, consumerSecret, oauthCallback }) {
  return doFetchRequestToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret }),
    // eslint-disable-next-line camelcase
    oauth_callback: oauthCallback,
  });
}

/**
 * @param {object} _
 * @param {string} _.consumerKey
 * @param {string} _.consumerSecret
 * @param {string} _.tokenSecret
 * @param {string} _.oauthToken
 * @param {string} _.oauthVerifier
 * @returns {Promise<RequestParams>}
 */
export function fetchAccessToken({ consumerKey, consumerSecret, tokenSecret, oauthToken, oauthVerifier }) {
  return doFetchAccessToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret, tokenSecret }),
    // eslint-disable-next-line camelcase
    oauth_token: oauthToken,
    // eslint-disable-next-line camelcase
    oauth_verifier: oauthVerifier,
  });
}
