import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { SetKeyElement } from './set-key.types.js';

/**
 * The key to scan and some scan options
 */
export interface ScanSetKeyCommandInput extends RedisHttpCommandInput, KeyScan {}

/**
 * The result when the scan is successful
 */
export interface ScanSetKeyCommandOutput extends KeyScanResult<SetKeyElement> {}
