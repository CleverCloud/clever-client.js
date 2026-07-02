import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';

/**
 * The `string` key to get
 */
export interface GetStringKeyCommandInput extends RedisHttpCommandInput, WithKey {}

/**
 * Response when the key has been found
 */
export interface GetStringKeyCommandOutput extends WithKey {
  /**
   * The value of the `string` key
   */
  value: string;
}
