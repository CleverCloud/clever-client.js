import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';

/**
 * The key and field to delete
 */
export interface DeleteHashKeyElementCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The field name
   */
  field: string;
}

/**
 * The result when the field has been deleted
 */
export interface DeleteHashKeyElementCommandOutput extends WithKey {
  /**
   * The field name
   */
  field: string;
  /**
   * `true` when the field has been deleted. `false` when the field was already absent.
   */
  deleted: boolean;
}
