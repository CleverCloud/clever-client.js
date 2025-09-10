/**
 * OAuth 1.0 token components required for PLAINTEXT authentication.
 * Used by CcAuthOauthV1Plaintext for authenticating requests to the Clever Cloud API.
 */
export interface OauthTokens {
  /**
   * The OAuth consumer key (also known as client key)
   * Identifies the client application to the Clever Cloud API
   */
  consumerKey: string;

  /**
   * The OAuth consumer secret (also known as client secret)
   * Used along with the token secret to sign requests
   */
  consumerSecret: string;

  /**
   * The OAuth access token
   * Identifies the user or application's authorization
   */
  token: string;

  /**
   * The OAuth token secret
   * Used along with the consumer secret to sign requests
   */
  secret: string;
}
