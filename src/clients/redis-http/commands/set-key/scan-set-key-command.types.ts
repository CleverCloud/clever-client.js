import type { KeyScan, KeyScanResult, RedisHttpCommandInput } from '../../types/redis-http.types.ts';
import type { SetKeyElement } from './set-key.types.ts';

/**
 * The key to scan and some scan options
 */
export type ScanSetKeyCommandInput = RedisHttpCommandInput & KeyScan;

/**
 * The result when the scan is successful
 */
export type ScanSetKeyCommandOutput = KeyScanResult<SetKeyElement>;
