import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarBucket } from './cellar.types.js';

export type CreateCellarBucketCommandInput = AddonId & {
  name: string;
  versioning?: boolean;
};

export type CreateCellarBucketCommandOutput = CellarBucket;
