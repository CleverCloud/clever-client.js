/**
 * @import { CcApiBridgeType, CcApiBridgeClientConfig } from './types/cc-api-bridge.types.js'
 */
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';
import { merge } from '../../lib/utils.js';

/**
 * Client for the Clever Cloud API Bridge.
 *
 * @extends {CcClient<CcApiBridgeType>}
 *
 * @example
 * // Create client
 * const client = new CcApiBridgeClient({
 *   oauthTokens: {
 *     consumerKey: 'consumerKey',
 *     consumerSecret: 'consumerSecret',
 *     token: 'token',
 *     secret: 'secret'
 *   }
 * });
 *
 * // Send a command
 * const result = await client.send(new ListApiTokenCommand());
 */
export class CcApiBridgeClient extends CcClient {
  /**
   * Creates a new API Bridge client instance.
   * The client always uses the api-bridge.clever-cloud.com endpoint and
   * optionally configures OAuth v1 PLAINTEXT authentication.
   *
   * @param {CcApiBridgeClientConfig} [config] - Client configuration including OAuth tokens
   */
  constructor(config) {
    super(
      merge({ baseUrl: 'https://api-bridge.clever-cloud.com' }, config),
      config?.oauthTokens == null ? null : new CcAuthOauthV1Plaintext(config.oauthTokens),
    );
  }
}
