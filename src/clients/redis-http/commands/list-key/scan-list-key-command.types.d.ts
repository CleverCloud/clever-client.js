import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { ListKeyElement } from './list-key.types.js';

/**
 * The key to scan and some scan options
 */
export interface ScanListKeyCommandInput extends RedisHttpCommandInput, Omit<KeyScan, 'match'> {}

/**
 * The result when the scan is successful
 */
export type ScanListKeyCommandOutput = KeyScanResult<ListKeyElement>;
