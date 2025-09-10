import type { CcClientConfig } from '../../../types/client.types.js';
import type { WithOptional } from '../../../types/utils.types.js';

/**
 * Type identifier for the Redis© HTTP proxy client.
 */
export type RedisHttpType = 'redis-http';

/**
 * Configuration for the Redis© HTTP proxy client.
 *
 * @example
 * const config: RedisHttpClientConfig = {
 *   // Redis database URL
 *   backendUrl: 'redis://my-redis-db:6379'
 * };
 */
export interface RedisHttpClientConfig extends WithOptional<CcClientConfig, 'baseUrl'> {
  /**
   * The default URL of the Redis© database (or any database compatible with the Redis© protocol).
   * This URL will be used for all commands that require a backend connection unless
   * overridden in the command parameters.
   */
  backendUrl?: string;
}

/**
 * Base interface for Redis© HTTP command input parameters.
 * All Redis commands that require a backend connection extend this interface.
 *
 * @example
 * interface GetCommandInput extends RedisHttpCommandInput {
 *   key: string;
 * }
 */
export interface RedisHttpCommandInput {
  /**
   * The URL of the Redis© database (or any database compatible with the Redis© protocol).
   * By default, uses the `backendUrl` provided in the `RedisHttpClient` config.
   * Can be overridden per command to use a different database.
   */
  backendUrl?: string;
}

/**
 * Parameters for Redis© scan operations.
 * Used to incrementally iterate over a collection of elements.
 *
 * @example
 * // Scan all keys matching 'user:*'
 * const scan: KeyScan = {
 *   key: 'users',
 *   match: 'user:*',
 *   count: 50
 * };
 */
export interface KeyScan extends WithKey {
  /**
   * The scan cursor. Default to `0`.
   * Use the cursor from the previous scan result to continue iteration.
   */
  cursor?: number;

  /**
   * The number of elements to scan. Default to `100`.
   * Adjust this value to control memory usage and response time.
   */
  count?: number;

  /**
   * The filter pattern to apply on elements.
   * Supports Redis© glob-style patterns (e.g. h?llo, h*llo, h[ae]llo).
   */
  match?: string;
}

/**
 * Result of a Redis© scan operation.
 * Contains the next cursor and the elements found in this iteration.
 *
 * @template T - Type of the scanned elements
 */
export interface KeyScanResult<T> extends WithKey {
  /**
   * The scan cursor to be used to continue the scan.
   * A cursor value of 0 indicates that the scan is complete.
   */
  cursor: number;

  /**
   * The list of scanned elements.
   * The type of elements depends on what is being scanned (keys, hash fields, set members, etc).
   */
  elements: Array<T>;
}

export interface WithKey {
  /**
   * The name of the key
   */
  key: string;
}
