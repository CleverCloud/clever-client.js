import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';
import type { ListKeyElement } from './list-key.types.js';

/**
 * The element to push and its position
 */
export interface AddListKeyElementCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The position in the list where to push the element.
   * - `tail` to add the element at the end of the list,
   * - `head` to add the element at the beginning of the list.
   *
   * Default is `tail`
   */
  position?: 'tail' | 'head';
  /**
   * The value of the element
   */
  value: string;
}

/**
 * The pushed element
 */
export interface AddListKeyElementCommandOutput extends ListKeyElement, WithKey {}
