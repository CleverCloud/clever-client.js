import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { Key } from './key.types.js';

/**
 * The key scan options
 */
export type ScanKeyCommandInput =
  | void
  | (RedisHttpCommandInput & {
      /**
       * The scan cursor. Default to `0`
       */
      cursor?: number;
      /**
       * The number of keys to scan. Default to `100`
       */
      count?: number;
      /**
       * The type of the keys to scan
       */
      type?: string;
      /**
       * The filter pattern to apply on the key names
       */
      match?: string;
    });

/**
 * One page of the key scan
 */
export interface ScanKeyCommandOutput {
  /**
   * The scan cursor to be used to continue the scan
   */
  cursor: number;
  /**
   * The total number of keys in the database. This is the whole key count, it does not take the
   * `type` and `match` filters into account.
   */
  total: number;
  /**
   * The list of scanned keys with their type
   */
  keys: Array<Key>;
}
