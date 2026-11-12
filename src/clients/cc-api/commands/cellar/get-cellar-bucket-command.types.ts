import type { CellarBucket, CellarBucketResourceId } from './cellar.types.ts';

/**
 * Identifies the bucket to retrieve.
 */
export type GetCellarBucketCommandInput = CellarBucketResourceId;

/**
 * The requested bucket.
 */
export type GetCellarBucketCommandOutput = CellarBucket;
