import { CcClient } from '../../lib/cc-client.js';
import type { CompositeCommand } from '../../lib/command/command.js';
import { merge } from '../../lib/utils.js';
import type { CcRequestConfigPartial } from '../../types/request.types.js';
import { RedisHttpCommand } from './lib/redis-http-command.js';
import type { RedisHttpClientConfig, RedisHttpCommandInput, RedisHttpType } from './types/redis-http.types.js';

/**
 * Client for the Redis© HTTP proxy service.
 * Provides HTTP access to Redis databases through Clever Cloud's proxy service.
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
export class RedisHttpClient extends CcClient<RedisHttpType> {
  /**
   * Default Redis© database URL to use for commands that require a backend.
   * Can be overridden per command via the backendUrl parameter.
   */
  #backendUrl: string | undefined;

  /**
   * Creates a new Redis© HTTP client instance.
   * By default, uses the https://kv-proxy.services.clever-cloud.com base URL
   * for the proxy service.
   *
   * @param config - Client configuration including Redis© backend URL
   */
  constructor(config?: RedisHttpClientConfig) {
    super(merge({ baseUrl: 'https://kv-proxy.services.clever-cloud.com' }, config));
    this.#backendUrl = config?.backendUrl;
  }

  /**
   * Transforms command parameters before sending to the proxy service.
   * For Redis© commands that require a backend URL, this method injects the default
   * backendUrl from the client config if not specified in the command parameters.
   *
   * @param command - Command to transform
   * @param _requestConfig - Additional request configuration
   * @returns Transformed command parameters
   */
  protected _transformCommandParams(
    command: RedisHttpCommand<unknown, unknown> | CompositeCommand<RedisHttpType, unknown, unknown>,
    _requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    if (
      this.#backendUrl != null &&
      command instanceof RedisHttpCommand &&
      command.requiresBackendUrl() &&
      (command.params as RedisHttpCommandInput)?.backendUrl == null
    ) {
      return Promise.resolve({
        ...(command.params as Record<string, unknown>),
        backendUrl: this.#backendUrl,
      });
    }
    return Promise.resolve(command.params);
  }
}
