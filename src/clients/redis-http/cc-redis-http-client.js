/**
 * @import { CcRedisHttpType, CcRedisHttpClientConfig } from './types/cc-redis-http.types.js'
 */
import { CcClient } from '../../lib/cc-client.js';

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
