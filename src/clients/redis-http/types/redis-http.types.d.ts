import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

export type RedisHttpType = 'redis-http';

export interface RedisHttpClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  /**
   * The default URL of the Redis© database (or any database compatible with the Redis© protocol)
   */
  backendUrl?: string;
}

export interface RedisHttpCommandInput {
  /**
   * The URL of the Redis© database (or any database compatible with the Redis© protocol).
   * By default, uses the `backendUrl` provided in the `RedisHttpClient` config.
   */
  backendUrl?: string;
}

export interface KeyScan extends WithKey {
  /**
   * The scan cursor. Default to `0`
   */
  cursor?: number;
  /**
   * The number of elements to scan. Default to `100`
   */
  count?: number;
  /**
   * The filter pattern to apply on elements
   */
  match?: string;
}

export interface KeyScanResult<T> extends WithKey {
  /**
   * The scan cursor to be used to continue the scan
   */
  cursor: number;
  /**
   * The list of scanned elements
   */
  elements: Array<T>;
}

export interface WithKey {
  /**
   * The name of the key
   */
  key: string;
}
