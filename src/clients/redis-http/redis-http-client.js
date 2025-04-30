/**
 * @import { RedisHttpType, RedisHttpClientConfig } from './types/redis-http.types.js'
 * @import { CcRequestConfig } from '../../types/request.types.js'
 * @import { CompositeCommand } from '../../lib/command/command.js'
 */
import { CcClient } from '../../lib/cc-client.js';
import { RedisHttpCommand } from './lib/redis-http-command.js';

/**
 * @extends {CcClient<RedisHttpType>}
 */
export class RedisHttpClient extends CcClient {
  /** @type {string|null} */
  #backendUrl;

  /**
   * @param {RedisHttpClientConfig} [config]
   */
  constructor(config) {
    super({
      baseUrl: 'https://kv-proxy.services.clever-cloud.com',
      ...(config ?? {}),
    });
    this.#backendUrl = config?.backendUrl;
  }

  /**
   * @param {RedisHttpCommand<?, ?> | CompositeCommand<RedisHttpType, ?, ?>} command
   * @param {Partial<CcRequestConfig>} [_requestConfig]
   * @returns {Promise<any>}
   * @protected
   */
  async _transformCommandParams(command, _requestConfig) {
    if (
      this.#backendUrl != null &&
      command instanceof RedisHttpCommand &&
      command.requiresBackendUrl() &&
      command.params.backendUrl == null
    ) {
      return {
        ...command.params,
        backendUrl: this.#backendUrl,
      };
    }
    return command.params;
  }
}
