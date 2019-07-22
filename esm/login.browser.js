import { prefixUrl } from './prefix-url';
import { request } from './request.fetch';
import { fetchAccessToken, fetchRequestToken } from './api/oauth.js';

export function getOauthParams ({ consumerKey, consumerSecret, tokenSecret = '' }) {
  return {
    oauth_consumer_key: consumerKey,
    oauth_signature_method: 'PLAINTEXT',
    oauth_signature: consumerSecret + '&' + tokenSecret,
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_nonce: Math.floor(Math.random() * 1000000),
  };
}

export function startLoginProcess ({ apiHost, consumerKey, consumerSecret, oauthCallback }) {

  const oauthParams = {
    oauth_callback: oauthCallback,
    ...getOauthParams({ consumerKey, consumerSecret }),
  };

  return fetchRequestToken(null, oauthParams)
    .then(prefixUrl(apiHost))
    .then(request);
}

export function finishLoginProcess ({ apiHost, consumerKey, consumerSecret, oauthToken, oauthVerifier, tokenSecret }) {

  const oauthParams = {
    ...getOauthParams({ consumerKey, consumerSecret, tokenSecret }),
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
  };

  return fetchAccessToken(null, oauthParams)
    .then(prefixUrl(apiHost))
    .then(request);
}
