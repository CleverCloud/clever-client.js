import { prepareRequestAuthV1Plaintext } from '../lib/auth/auth-oauth-v1-plaintext.js';
import { CcClient } from '../lib/cc-client.js';

/**
 * @typedef {import('../types/auth.types.js').CcAuth} CcAuth
 * @typedef {import('../types/clever-client.types.js').CcAuthBackendClientConfig} CcAuthBackendClientConfig
 * @typedef {import('../types/request.types.js').CcRequestConfig} CcRequestConfig
 */

/**
 *
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

  /**
   * @param {import('./commands/abstract-auth-backend-command.js').AbstractAuthBackendCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   */
  async send(command, requestConfig) {
    return super.send(command, requestConfig);
  }

  /**
   * @returns {CcAuth}
   */
  getAuth() {
    return this.#auth;
  }
}
