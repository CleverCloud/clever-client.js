import { CcClient } from '../../lib/cc-client.ts';
import { merge } from '../../lib/utils.ts';
import { RedisHttpParamsTransformer } from './lib/redis-http-params-transformer.ts';
import type { RedisHttpClientConfig, RedisHttpType } from './types/redis-http.types.ts';

/**
 * Client for the Redis© HTTP proxy service.
 * Provides HTTP access to Redis databases through Clever Cloud's proxy service.
 *
 * For commands that require a backend, the default `backendUrl` of the config is used unless
 * the command specifies its own.
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
   * Creates a new Redis© HTTP client instance.
   * By default, uses the https://kv-proxy.services.clever-cloud.com base URL
   * for the proxy service.
   *
   * @param config - Client configuration including Redis© backend URL
   */
  constructor(config?: RedisHttpClientConfig) {
    super(
      merge({ baseUrl: 'https://kv-proxy.services.clever-cloud.com' }, config),
      undefined,
      new RedisHttpParamsTransformer(config?.backendUrl),
    );
  }
}
