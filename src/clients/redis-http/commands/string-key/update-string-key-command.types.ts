import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';

/**
 * The `string` key to update
 */
export interface UpdateStringKeyCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The value of the `string` key
   */
  value: string;
}

/**
 * Response when the key has been updated
 */
export interface UpdateStringKeyCommandOutput extends WithKey {
  /**
   * The value of the `string` key
   */
  value: string;
}
