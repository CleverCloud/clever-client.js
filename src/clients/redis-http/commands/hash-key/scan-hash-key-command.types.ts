import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.ts';
import type { HashKeyElement } from './hash-key.types.ts';

/**
 * The key to scan and some scan options
 */
export interface ScanHashKeyCommandInput extends RedisHttpCommandInput, KeyScan {}

/**
 * The result when the scan is successful
 */
export type ScanHashKeyCommandOutput = KeyScanResult<HashKeyElement>;
