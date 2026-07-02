import type { RedisHttpCommandInput, WithKey } from '../../types/redis-http.types.js';
import type { SetKeyElement } from './set-key.types.js';

/**
 * The key and member to add
 */
export interface AddSetKeyElementCommandInput extends RedisHttpCommandInput, WithKey {
  /**
   * The member
   */
  element: SetKeyElement;
}

/**
 * The result when the member has been added
 */
export interface AddSetKeyElementCommandOutput extends WithKey {
  /**
   * The member
   */
  element: SetKeyElement;
  /**
   * `true` when the member has been added. `false` when the member was already present.
   */
  added: boolean;
}
