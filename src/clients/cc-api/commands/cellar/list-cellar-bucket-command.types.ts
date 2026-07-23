import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarBucketList } from './cellar.types.js';

/**
 * Identifies the Cellar add-on whose buckets are listed. The owner is resolved automatically when
 * omitted.
 */
export type ListCellarBucketCommandInput = AddonId;

/**
 * The buckets of the add-on.
 */
export type ListCellarBucketCommandOutput = CellarBucketList;
