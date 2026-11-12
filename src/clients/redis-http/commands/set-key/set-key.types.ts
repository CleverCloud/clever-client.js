import type { WithKey } from '../../types/redis-http.types.ts';

/**
 * The `set` key with a list of members
 */
export interface SetKey extends WithKey {
  /**
   * The list of members
   */
  elements: Array<SetKeyElement>;
}

/**
 * The `set` member
 */
export type SetKeyElement = string;
