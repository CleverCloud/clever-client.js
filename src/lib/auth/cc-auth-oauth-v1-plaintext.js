/**
 * @import { OauthTokens } from '../../types/auth.types.js'
 */

import { CcAuth } from './cc-auth.js';

/**
 * OAuth v1 PLAINTEXT authentication implementation for Clever Cloud.
 *
 * This class implements OAuth 1.0 authentication using the PLAINTEXT signature method.
 * It formats the OAuth token components into a valid OAuth Authorization header
 * according to the OAuth 1.0 specification.
 *
 * Key features:
 * - Uses PLAINTEXT signature method (no hashing)
 * - Supports both header and URL-based authentication
 * - Omits optional OAuth parameters (nonce, timestamp, version)
 *
 * @see {@link https://oauth.net/core/1.0/#auth_header} OAuth 1.0 Authorization Header
 */
export class CcAuthOauthV1Plaintext extends CcAuth {
  /** @type {OauthTokens} */
  #oauthToken;

  /**
   * Creates a new OAuth v1 PLAINTEXT authentication instance.
   *
   * @param {OauthTokens} oauthToken - OAuth token components containing:
   *        - consumerKey: The OAuth consumer key
   *        - consumerSecret: The OAuth consumer secret
   *        - token: The OAuth token
   *        - secret: The OAuth token secret
   */
  constructor(oauthToken) {
    super();
    this.#oauthToken = oauthToken;
  }

  /**
   * Generates the OAuth Authorization header value.
   * Formats the OAuth parameters according to the OAuth 1.0 specification,
   * using the PLAINTEXT signature method.
   *
   * The following OAuth parameters are included:
   * - oauth_consumer_key
   * - oauth_token
   * - oauth_signature (formatted as consumerSecret&tokenSecret)
   *
   * Optional parameters (omitted):
   * - oauth_nonce
   * - oauth_signature_method (defaults to PLAINTEXT)
   * - oauth_timestamp
   * - oauth_version (defaults to 1.0)
   *
   * @returns {string} The formatted OAuth Authorization header value
   */
  getAuthorization() {
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
