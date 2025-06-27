/**
 * @import { CcAuthBackendType, CcAuthBackendClientConfig } from './types/cc-auth-backend.types.js'
 */
import { CcAuthOauthV1Plaintext } from '../../lib/auth/cc-auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';

/**
 * @extends {CcClient<CcAuthBackendType>}
 */
export class CcAuthBackendClient extends CcClient {
  /**
   * @param {CcAuthBackendClientConfig} config
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
