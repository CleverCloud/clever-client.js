import { CcClient } from '../lib/cc-client.js';

/**
 * @typedef {import('../types/clever-client.types.js').CcApiClientConfig} CcApiClientConfig
 * @typedef {import('../types/request.types.js').CcRequestConfig} CcRequestConfig
 */

/**
 *
 */
export class CcApiClient extends CcClient {
  /**
   * @param {CcApiClientConfig} config
   */
  constructor(config) {
    super({
      baseUrl: 'https://api.clever-cloud.com',
      ...config,
    });
  }

  /**
   * @param {import('./commands/abstract-api-command.js').AbstractApiCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   */
  async send(command, requestConfig) {
    return super.send(command, requestConfig);
  }
}
