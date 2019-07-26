import OAuth from 'oauth-1.0a';
import { fetchAccessToken as doFetchAccessToken, fetchRequestToken as doFetchRequestToken } from './api/oauth.js';

// TODO expose this?
export function getOauthParams ({ consumerKey, consumerSecret, tokenSecret = '' }) {
  return {
    oauth_consumer_key: consumerKey,
    oauth_signature_method: 'PLAINTEXT',
    oauth_signature: consumerSecret + '&' + tokenSecret,
    oauth_timestamp: OAuth.prototype.getTimeStamp(),
    oauth_nonce: OAuth.prototype.getNonce(),
  };
}

export function fetchRequestToken ({ consumerKey, consumerSecret, oauthCallback }) {
  return doFetchRequestToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret }),
    oauth_callback: oauthCallback,
  });
}

export function fetchAccessToken ({ consumerKey, consumerSecret, tokenSecret, oauthToken, oauthVerifier }) {
  return doFetchAccessToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret, tokenSecret }),
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
  });
}
