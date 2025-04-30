/**
 * @import { CcApiClientConfigWithApiToken } from './types/cc-api.types.js'
 * @import { CcAuth } from '../../types/auth.types.js'
 */
import { prepareRequestWithBearerToken } from '../../lib/auth/auth-bearer-token.js';
import { CcApiClient } from './cc-api-client.js';

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
