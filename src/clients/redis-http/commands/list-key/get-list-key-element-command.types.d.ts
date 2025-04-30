import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';
import type { ListKeyElement } from './list-key.types.js';

/**
 * The element to get
 */
export interface GetListKeyElementCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The index of the element
   */
  index: number;
}

/**
 * The result when the element has been found
 */
export interface GetListKeyElementCommandOutput extends ListKeyElement, WithKey {}
