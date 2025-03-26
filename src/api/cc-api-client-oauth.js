import { prepareRequestAuthV1Plaintext } from '../common/lib/auth/auth-oauth-v1-plaintext.js';
import { CcApiClient } from './cc-api-client.js';

/**
 * @typedef {import('../common/types/auth.types.js').CcAuth} CcAuth
 * @typedef {import('../common/types/clever-client.types.js').CcApiClientConfigWithOAuth} CcApiClientConfigWithOAuth
 * @typedef {import('../common/types/request.types.js').CcRequestConfig} CcRequestConfig
 */

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

  /**
   * @returns {CcAuth}
   */
  getAuth() {
    return this.#auth;
  }
}
