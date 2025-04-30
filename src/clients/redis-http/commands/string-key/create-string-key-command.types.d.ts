import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';

/**
 * The `string` key to create
 */
export interface CreateStringKeyCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The value of the `string` key
   */
  value: string;
}

/**
 * Response when the key has been updated
 */
export interface CreateStringKeyCommandOutput extends WithKey {
  /**
   * The value of the `string` key
   */
  value: string;
}
