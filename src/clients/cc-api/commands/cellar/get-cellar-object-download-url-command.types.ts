import type { CellarBucketResourceId, CellarSignedUrl } from './cellar.types.js';

/**
 * Identifies the object to mint a download URL for, and how long that URL should live.
 */
export interface GetCellarObjectDownloadUrlCommandInput extends CellarBucketResourceId {
  /** Full key of the object, slashes included. Sent in the body rather than in the path. */
  objectKey: string;
  /** How long the URL stays valid, in seconds. Falls back to the platform default. */
  expiresIn?: number;
}

/**
 * The presigned download URL and when it expires.
 */
export type GetCellarObjectDownloadUrlCommandOutput = CellarSignedUrl;
