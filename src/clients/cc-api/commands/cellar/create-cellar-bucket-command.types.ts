import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarBucket } from './cellar.types.js';

/**
 * Identifies the Cellar add-on to create a bucket in, along with the bucket to create.
 */
export type CreateCellarBucketCommandInput = AddonId & {
  /** Name to give to the bucket, unique within the add-on. */
  name: string;
  /** Whether the bucket keeps previous versions of its objects. Defaults to `false`. */
  versioning?: boolean;
};

/**
 * The freshly created bucket.
 */
export type CreateCellarBucketCommandOutput = CellarBucket;
