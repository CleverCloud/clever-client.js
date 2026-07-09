import { oauthV1AuthorizationHeader } from '../src/utils/auth-utils.ts';
import type { OAuthTokens } from './oauth.types.js';
import type { RequestParams } from './request.types.js';

export function addOauthHeader(tokens: OAuthTokens): (requestParams: RequestParams) => Promise<RequestParams> {
  return function (requestParams) {
    const authorization = oauthV1AuthorizationHeader({
      consumerKey: tokens.OAUTH_CONSUMER_KEY,
      consumerSecret: tokens.OAUTH_CONSUMER_SECRET,
      token: tokens.API_OAUTH_TOKEN,
      secret: tokens.API_OAUTH_TOKEN_SECRET,
    });

    return Promise.resolve({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        authorization,
      },
    });
  };
}
