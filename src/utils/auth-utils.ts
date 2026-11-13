import type { OauthTokens } from '../types/auth.types.ts';

/**
 * Returns the API token formatted as a Bearer token.
 *
 * @returns The token in the format 'Bearer <api-token>'
 */
export function bearerAuthorizationHeader(token: string) {
  return `Bearer ${token}`;
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
 * @returns The formatted OAuth Authorization header value
 */
export function oauthV1AuthorizationHeader(tokens: OauthTokens) {
  const token = [
    `oauth_consumer_key="${tokens.consumerKey}"`,
    `oauth_token="${tokens.token}"`,
    // %26 is URL escaped character "&"
    `oauth_signature="${tokens.consumerSecret}%26${tokens.secret}"`,
    // oauth_nonce is not mandatory
    // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
    // oauth_timestamp is not mandatory
    // oauth_version is not mandatory, it defaults to 1.0
  ].join(', ');

  return `OAuth ${token}`;
}
