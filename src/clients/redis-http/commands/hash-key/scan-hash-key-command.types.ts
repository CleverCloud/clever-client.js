import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.js';
import type { HashKeyElement } from './hash-key.types.js';

/**
 * The key to scan and some scan options
 */
export interface ScanHashKeyCommandInput extends RedisHttpCommandInput, KeyScan {}

/**
 * The result when the scan is successful
 */
export type ScanHashKeyCommandOutput = KeyScanResult<HashKeyElement>;
