import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';
import type { HashKeyElement } from './hash-key.types.js';

/**
 * The key, field and value to add or update
 */
export interface SetHashKeyElementCommandInput extends RedisHttpCommandInput, WithKey, HashKeyElement {}

/**
 * The result when the field has been added or updated
 */
export interface SetHashKeyElementCommandOutput extends HashKeyElement, WithKey {
  /**
   * `true` when a new field has been added. `false` when a field has been updated.
   */
  added: boolean;
}
