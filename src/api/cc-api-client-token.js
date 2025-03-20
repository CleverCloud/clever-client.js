import { prepareRequestWithBearerToken } from '../lib/auth/auth-bearer-token.js';
import { CcApiClient } from './cc-api-client.js';

/**
 * @typedef {import('../types/auth.types.js').CcAuth} CcAuth
 * @typedef {import('../types/clever-client.types.js').CcApiClientConfigWithApiToken} CcApiClientConfigWithApiToken
 * @typedef {import('../types/request.types.js').CcRequestConfig} CcRequestConfig
 */

/**
 *
 */
export class CcApiClientToken extends CcApiClient {
  /** @type {CcAuth} */
  #auth;

  /**
   * @param {CcApiClientConfigWithApiToken} config
   */
  constructor(config) {
    super({
      baseUrl: 'https://api-bridge.clever-cloud.com',
      ...config,
    });
    this.#auth = (request) => prepareRequestWithBearerToken(request, config.apiToken);
  }

  /**
   * @returns {CcAuth}
   */
  getAuth() {
    return this.#auth;
  }
}
