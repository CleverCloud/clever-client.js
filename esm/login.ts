import { fetchAccessToken as doFetchAccessToken, fetchRequestToken as doFetchRequestToken } from './api/v2/oauth.js';

import type { RequestParams } from './request.types.js';

export function getOauthParams({
  consumerKey,
  consumerSecret,
  tokenSecret = '',
}: {
  consumerKey: string;
  consumerSecret: string;
  tokenSecret?: string;
}): { oauth_consumer_key: string; oauth_signature_method: string; oauth_signature: string } {
  return {
    oauth_consumer_key: consumerKey,

    oauth_signature_method: 'PLAINTEXT',

    oauth_signature: consumerSecret + '&' + tokenSecret,
  };
}

export function fetchRequestToken({
  consumerKey,
  consumerSecret,
  oauthCallback,
}: {
  consumerKey: string;
  consumerSecret: string;
  oauthCallback: string;
}): Promise<RequestParams> {
  return doFetchRequestToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret }),

    oauth_callback: oauthCallback,
  });
}

export function fetchAccessToken({
  consumerKey,
  consumerSecret,
  tokenSecret,
  oauthToken,
  oauthVerifier,
}: {
  consumerKey: string;
  consumerSecret: string;
  tokenSecret: string;
  oauthToken: string;
  oauthVerifier: string;
}): Promise<RequestParams> {
  return doFetchAccessToken(null, {
    ...getOauthParams({ consumerKey, consumerSecret, tokenSecret }),

    oauth_token: oauthToken,

    oauth_verifier: oauthVerifier,
  });
}
