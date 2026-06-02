import type { OauthTokens } from '../../../types/auth.types.js';
import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

/**
 * Type identifier for the Clever Cloud API Bridge client.
 */
export type CcApiBridgeType = 'cc-api-bridge';

/**
 * Configuration for the API Bridge client.
 *
 * @example
 * const config: CcApiBridgeClientConfig = {
 *   oauthTokens: {
 *     consumerKey: 'consumerKey',
 *     consumerSecret: 'consumerSecret',
 *     token: 'token',
 *     secret: 'secret'
 *   }
 * };
 */
export interface CcApiBridgeClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  /**
   * OAuth v1 tokens for authentication.
   * The API Bridge only supports OAuth v1 PLAINTEXT authentication.
   */
  oauthTokens: OauthTokens;
}
