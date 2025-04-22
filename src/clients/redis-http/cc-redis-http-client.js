import { CcClient } from '../../lib/cc-client.js';

/**
 * @typedef {import('./types/cc-redis-http.types.js').CcRedisHttpType} CcRedisHttpType
 * @typedef {import('./types/cc-redis-http.types.js').CcRedisHttpClientConfig} CcRedisHttpClientConfig
 */

/**
 * @extends {CcClient<CcRedisHttpType>}
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
}
