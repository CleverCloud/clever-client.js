/**
 * @import { RedisHttpType, RedisHttpClientConfig } from './types/redis-http.types.js'
 * @import { CcRequestConfig } from '../../types/request.types.js'
 * @import { CompositeCommand } from '../../lib/command/command.js'
 */
import { CcClient } from '../../lib/cc-client.js';
import { merge } from '../../lib/utils.js';
import { RedisHttpCommand } from './lib/redis-http-command.js';

/**
 * Client for the Redis© HTTP proxy service.
 * Provides HTTP access to Redis databases through Clever Cloud's proxy service.
 *
 * @extends {CcClient<RedisHttpType>}
 *
 * @example
 * // Create client
 * const client = new RedisHttpClient({
 *   backendUrl: 'redis://my-redis-db:6379',
 * });
 *
 * // Send commands
 * const value = await client.send(new CmdSendCommand({
 *   command: 'GET',
 *   args: ['my-key'],
 * }));
 */
export class RedisHttpClient extends CcClient {
  /**
   * Default Redis© database URL to use for commands that require a backend.
   * Can be overridden per command via the backendUrl parameter.
   *
   * @type {string|null}
   */
  #backendUrl;

  /**
   * Creates a new Redis© HTTP client instance.
   * By default, uses the https://kv-proxy.services.clever-cloud.com base URL
   * for the proxy service.
   *
   * @param {RedisHttpClientConfig} [config] - Client configuration including Redis© backend URL
   */
  constructor(config) {
    super(merge({ baseUrl: 'https://kv-proxy.services.clever-cloud.com' }, config));
    this.#backendUrl = config?.backendUrl;
  }

  /**
   * Transforms command parameters before sending to the proxy service.
   * For Redis© commands that require a backend URL, this method injects the default
   * backendUrl from the client config if not specified in the command parameters.
   *
   * @param {RedisHttpCommand<?, ?> | CompositeCommand<RedisHttpType, ?, ?>} command - Command to transform
   * @param {Partial<CcRequestConfig>} [_requestConfig] - Additional request configuration
   * @returns {Promise<any>} Transformed command parameters
   * @protected
   */
  async _transformCommandParams(command, _requestConfig) {
    if (
      this.#backendUrl != null &&
      command instanceof RedisHttpCommand &&
      command.requiresBackendUrl() &&
      command.params?.backendUrl == null
    ) {
      return {
        ...command.params,
        backendUrl: this.#backendUrl,
      };
    }
    return command.params;
  }
}
