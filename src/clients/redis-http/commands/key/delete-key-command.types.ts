import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';

/**
 * The key to delete
 */
export interface DeleteKeyCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The name of the key
   */
  key: string;
}

/**
 * The deleted key
 */
export interface DeleteKeyCommandOutput extends WithKey {
  /**
   * `true` when the key has been deleted. `false` when the key was already absent.
   */
  deleted: boolean;
}
