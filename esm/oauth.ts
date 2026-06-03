import type { OAuthTokens } from './oauth.types.js';
import type { RequestParams } from './request.types.js';

export function addOauthHeader(tokens: OAuthTokens): (requestParams: RequestParams) => Promise<RequestParams> {
  return function (requestParams) {
    const authorization =
      'OAuth ' +
      [
        `oauth_consumer_key="${tokens.OAUTH_CONSUMER_KEY}"`,
        `oauth_token="${tokens.API_OAUTH_TOKEN}"`,
        // %26 is URL escaped character "&"
        `oauth_signature="${tokens.OAUTH_CONSUMER_SECRET}%26${tokens.API_OAUTH_TOKEN_SECRET}"`,
        // oauth_nonce is not mandatory
        // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
        // oauth_timestamp is not mandatory
        // oauth_version is not mandatory, it defaults to 1.0
      ].join(', ');

    return Promise.resolve({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        authorization,
      },
    });
  };
}
