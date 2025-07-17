/**
 * @import { OauthTokens } from '../../types/auth.types.js'
 */

import { CcAuth } from './cc-auth.js';

/**
 * @abstract
 */
export class CcAuthOauthV1Plaintext extends CcAuth {
  /** @type {OauthTokens} */
  #oauthToken;

  /**
   * @param {OauthTokens} oauthToken
   */
  constructor(oauthToken) {
    super();
    this.#oauthToken = oauthToken;
  }

  /**
   * @returns {string}
   */
  getToken() {
    const token = [
      `oauth_consumer_key="${this.#oauthToken.consumerKey}"`,
      `oauth_token="${this.#oauthToken.token}"`,
      // %26 is URL escaped character "&"
      `oauth_signature="${this.#oauthToken.consumerSecret}%26${this.#oauthToken.secret}"`,
      // oauth_nonce is not mandatory
      // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
      // oauth_timestamp is not mandatory
      // oauth_version is not mandatory, it defaults to 1.0
    ].join(', ');

    return `OAuth ${token}`;
  }
}
