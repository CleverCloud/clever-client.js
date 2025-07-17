import type { WithKey } from '../../types/redis-http.types.js';

/**
 * The `list` key with a list of elements
 */
export interface ListKey extends WithKey {
  /**
   * The list of elements
   */
  elements: Array<ListKeyElement>;
}

/**
 * The `list` element
 */
export interface ListKeyElement {
  /**
   * The index of the element
   */
  index: number;
  /**
   * The value of the element
   */
  value: string;
}
