import { prepareRequestWithBearerToken } from '../../lib/auth/auth-bearer-token.js';
import { CcApiClient } from './cc-api-client.js';

/**
 * @typedef {import('./types/cc-api.types.js').CcApiClientConfigWithApiToken} CcApiClientConfigWithApiToken
 * @typedef {import('../../types/auth.types.js').CcAuth} CcAuth
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

  /** @type {CcApiClient['_getAuth']} */
  _getAuth() {
    return this.#auth;
  }
}
