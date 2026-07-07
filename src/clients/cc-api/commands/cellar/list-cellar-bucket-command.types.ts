import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarBucketList } from './cellar.types.js';

export type ListCellarBucketCommandInput = AddonId;

export type ListCellarBucketCommandOutput = CellarBucketList;
