import OAuth from 'oauth-1.0a';
import { fetchAccessToken as doFetchAccessToken, fetchRequestToken as doFetchRequestToken } from './api/v2/oauth.js';

/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {object} _
 * @param {string} _.consumerKey
 * @param {string} _.consumerSecret
 * @param {string} [_.tokenSecret]
 * @returns {{oauth_consumer_key: string, oauth_signature_method: string, oauth_signature: string, oauth_timestamp: number, oauth_nonce: string}}
 */
export function getOauthParams({ consumerKey, consumerSecret, tokenSecret = '' }) {
  // We need this for getNonce()
  // eslint-disable-next-line camelcase
  OAuth.prototype.nonce_length = 32;
  return {
    // eslint-disable-next-line camelcase
    oauth_consumer_key: consumerKey,
    // eslint-disable-next-line camelcase
    oauth_signature_method: 'PLAINTEXT',
    // eslint-disable-next-line camelcase
    oauth_signature: consumerSecret + '&' + tokenSecret,
    // eslint-disable-next-line camelcase
    oauth_timestamp: OAuth.prototype.getTimeStamp(),
    // eslint-disable-next-line camelcase
    oauth_nonce: OAuth.prototype.getNonce(),
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
