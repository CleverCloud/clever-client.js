import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';
import type { SetKeyElement } from './set-key.types.js';

/**
 * The key and member to delete
 */
export interface DeleteSetKeyElementCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The member
   */
  element: SetKeyElement;
}

/**
 * The result when the member has been deleted
 */
export interface DeleteSetKeyElementCommandOutput extends WithKey {
  /**
   * The member
   */
  element: SetKeyElement;
  /**
   * `true` when the member has been deleted. `false` when the member was already absent.
   */
  deleted: boolean;
}
