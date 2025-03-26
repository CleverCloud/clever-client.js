import { CcClient } from '../common/lib/cc-client.js';

/**
 * @typedef {import('../common/types/clever-client.types.js').CcRedisHttpClientConfig} CcRedisHttpClientConfig
 * @typedef {import('../common/types/request.types.js').CcRequestConfig} CcRequestConfig
 */

export class CcRedisHttpClient extends CcClient {
  /**
   * @param {CcRedisHttpClientConfig} config
   */
  constructor(config) {
    super({
      baseUrl: 'https://kv-proxy.services.clever-cloud.com',
      ...config,
    });
  }

  /**
   * @param {import('./commands/abstract-redis-http-command.js').AbstractRedisHttpCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   */
  async send(command, requestConfig) {
    return super.send(command, requestConfig);
  }
}
