/**
 * @typedef {import('./oauth.types.js').OAuthTokens} OAuthTokens
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {OAuthTokens} tokens
 * @returns {(requestParams: RequestParams) => Promise<RequestParams>}
 */
export function addOauthHeader(tokens) {
  return async function (requestParams) {
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

    return {
      ...requestParams,
      headers: {
        ...requestParams.headers,
        authorization,
      },
    };
  };
}
