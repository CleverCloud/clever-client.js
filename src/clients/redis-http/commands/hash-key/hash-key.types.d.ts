import type { WithKey } from '../../types/redis-http.types.js';

/**
 * The `hash` key with a list of fields
 */
export interface HashKey extends WithKey {
  /**
   * The list of fields
   */
  elements: Array<HashKeyElement>;
}

/**
 * The `hash` key field
 */
export interface HashKeyElement {
  /**
   * The field name
   */
  field: string;
  /**
   * The field value
   */
  value: string;
}
