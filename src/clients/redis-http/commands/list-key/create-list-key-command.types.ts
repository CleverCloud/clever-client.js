import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.ts';

/**
 * The key and its elements to create
 */
export interface CreateListKeyCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The list of elements
   */
  elements: Array<string>;
}

/**
 * The created key and its elements
 */
export interface CreateListKeyCommandOutput extends WithKey {
  /**
   * The list of elements
   */
  elements: Array<string>;
}
