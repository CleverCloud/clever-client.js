import type { CellarBucket, CellarBucketResourceId } from './cellar.types.js';

/**
 * Identifies the bucket to retrieve.
 */
export type GetCellarBucketCommandInput = CellarBucketResourceId;

/**
 * The requested bucket.
 */
export type GetCellarBucketCommandOutput = CellarBucket;
