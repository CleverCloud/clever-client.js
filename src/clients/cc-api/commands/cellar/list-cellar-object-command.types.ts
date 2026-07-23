import type { CellarBucketResourceId, CellarObjectList } from './cellar.types.js';

/**
 * Identifies the bucket to list, which part of it, and how much of each entry to fetch.
 */
export interface ListCellarObjectCommandInput extends CellarBucketResourceId {
  /** Key prefix to list under, acting as the directory being browsed. */
  prefix?: string;
  /** Cursor returned by a previous page. Omit it to start from the beginning. */
  cursor?: string;
  /** How many entries to return on this page. */
  count?: number;
  /** Whether to also fetch each object's content type and user metadata. */
  withMetadata?: boolean;
}

/**
 * One page of the bucket's contents.
 */
export type ListCellarObjectCommandOutput = CellarObjectList;
