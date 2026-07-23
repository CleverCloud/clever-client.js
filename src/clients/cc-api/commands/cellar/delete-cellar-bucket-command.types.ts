import type { CellarBucketResourceId } from './cellar.types.js';

/**
 * Identifies the bucket to remove, and what to do with the objects it still holds.
 */
export interface DeleteCellarBucketCommandInput extends CellarBucketResourceId {
  /**
   * Whether to delete the objects the bucket still holds. Without it, removing a non-empty bucket fails.
   * @sentAs `purgeObjects`
   */
  shouldPurgeObjects?: boolean;
}
