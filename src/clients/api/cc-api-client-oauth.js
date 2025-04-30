/**
 * @import { CcApiClientConfigWithOAuth } from './types/cc-api.types.js'
 * @import { CcAuth } from '../../types/auth.types.js'
 */
import { prepareRequestAuthV1Plaintext } from '../../lib/auth/auth-oauth-v1-plaintext.js';
import { CcApiClient } from './cc-api-client.js';

/**
 *
 */
export class CcApiClientOAuth extends CcApiClient {
  /** @type {CcAuth} */
  #auth;

  /**
   * @param {CcApiClientConfigWithOAuth} config
   */
  constructor(config) {
    super(config);
    this.#auth = (request) => prepareRequestAuthV1Plaintext(request, config.oAuthTokens);
  }

  /** @type {CcApiClient['_getAuth']} */
  _getAuth() {
    return this.#auth;
  }
}
