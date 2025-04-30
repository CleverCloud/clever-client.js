/**
 * @import { CcAuthBackendType, CcAuthBackendClientConfig } from './types/cc-auth-backend.types.js'
 * @import { CcAuth } from '../../types/auth.types.js'
 */
import { prepareRequestAuthV1Plaintext } from '../../lib/auth/auth-oauth-v1-plaintext.js';
import { CcClient } from '../../lib/cc-client.js';

/**
 * @extends {CcClient<CcAuthBackendType>}
 */
export class CcAuthBackendClient extends CcClient {
  /** @type {CcAuth} */
  #auth;

  /**
   * @param {CcAuthBackendClientConfig} config
   */
  constructor(config) {
    super({
      baseUrl: 'https://api-bridge.clever-cloud.com',
      ...config,
    });
    this.#auth = (request) => prepareRequestAuthV1Plaintext(request, config.oAuthTokens);
  }

  /** @type {CcClient<?>['_getAuth']} */
  _getAuth() {
    return this.#auth;
  }
}
