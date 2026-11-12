import type { OauthTokens } from '../../../types/auth.types.ts';
import type { CcClientConfig } from '../../../types/client.types.ts';
import type { Composer } from '../../../types/command.types.ts';
import type { WithOptional } from '../../../types/utils.types.ts';

/**
 * Type identifier for the Clever Cloud API Bridge client.
 */
export type CcApiBridgeType = 'cc-api-bridge';

/**
 * Function type for composing multiple API Bridge commands into a single operation.
 */
export type CcApiBridgeComposer = Composer<CcApiBridgeType>;

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
