/**
 * @typedef {import('./plugins.type.js').PrepareRequestPlugin} PrepareRequestPlugin
 */

import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @param {string} oauthConsumerKey
 * @param {string} oauthConsumerSecret
 * @param {string} oauthUserToken
 * @param {string} oauthUserSecret
 * @returns {PrepareRequestPlugin}
 */
export function prepareRequestAuthV1Plaintext (oauthConsumerKey, oauthConsumerSecret, oauthUserToken, oauthUserSecret) {
  return {
    type: 'prepareRequest',
    handle (requestParams) {
      const oauthTokens = [
        `oauth_consumer_key="${oauthConsumerKey}"`,
        `oauth_token="${oauthUserToken}"`,
        // %26 is URL escaped character "&"
        `oauth_signature="${oauthConsumerSecret}%26${oauthUserSecret}"`,
        // oauth_nonce is not mandatory
        // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
        // oauth_timestamp is not mandatory
        // oauth_version is not mandatory, it defaults to 1.0
      ].join(', ');

      requestParams.headers = new HeadersBuilder(requestParams.headers).authorization(`OAuth ${oauthTokens}`).build();

      return requestParams;
    },
  };
}
