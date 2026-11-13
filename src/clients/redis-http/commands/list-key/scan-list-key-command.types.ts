import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.ts';
import type { ListKeyElement } from './list-key.types.ts';

/**
 * The key to scan and some scan options
 */
export interface ScanListKeyCommandInput extends RedisHttpCommandInput, Omit<KeyScan, 'match'> {}

/**
 * The result when the scan is successful
 */
export interface ScanListKeyCommandOutput extends KeyScanResult<ListKeyElement> {
  /**
   * The total number of elements held in the `list` key (its full length),
   * independent of the current scan window.
   */
  total: number;
}
