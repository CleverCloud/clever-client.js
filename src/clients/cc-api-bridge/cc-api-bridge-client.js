/**
 * @import { CcApiBridgeType, CcApiBridgeClientConfig } from './types/cc-api-bridge.types.js'
 */
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';

/**
 * @extends {CcClient<CcApiBridgeType>}
 */
export class CcApiBridgeClient extends CcClient {
  /**
   * @param {CcApiBridgeClientConfig} config
   */
  constructor(config) {
    super(
      {
        baseUrl: 'https://api-bridge.clever-cloud.com',
        ...config,
      },
      new CcAuthOauthV1Plaintext(config.oauthTokens),
    );
  }
}
