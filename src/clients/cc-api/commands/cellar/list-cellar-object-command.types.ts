import type { CellarBucketResourceId, CellarObjectList } from './cellar.types.js';

export interface ListCellarObjectCommandInput extends CellarBucketResourceId {
  prefix?: string;
  cursor?: string;
  count?: number;
  withMetadata?: boolean;
}

export type ListCellarObjectCommandOutput = CellarObjectList;
