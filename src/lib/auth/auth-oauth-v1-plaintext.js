/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 * @import { OAuthTokens } from '../../types/auth.types.js'
 */
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @param {Partial<CcRequestParams>} requestParams
 * @param {OAuthTokens} oAuthTokens
 * @returns {Partial<CcRequestParams>}
 */
export function prepareRequestAuthV1Plaintext(requestParams, oAuthTokens) {
  const oauthTokens = [
    `oauth_consumer_key="${oAuthTokens.consumerKey}"`,
    `oauth_token="${oAuthTokens.token}"`,
    // %26 is URL escaped character "&"
    `oauth_signature="${oAuthTokens.consumerSecret}%26${oAuthTokens.secret}"`,
    // oauth_nonce is not mandatory
    // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
    // oauth_timestamp is not mandatory
    // oauth_version is not mandatory, it defaults to 1.0
  ].join(', ');

  return {
    ...requestParams,
    headers: new HeadersBuilder(requestParams.headers).authorization(`OAuth ${oauthTokens}`).build(),
  };
}
