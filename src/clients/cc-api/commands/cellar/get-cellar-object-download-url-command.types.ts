import type { CellarBucketResourceId, CellarSignedUrl } from './cellar.types.js';

export interface GetCellarObjectDownloadUrlCommandInput extends CellarBucketResourceId {
  objectKey: string;
  expiresIn?: number;
}

export type GetCellarObjectDownloadUrlCommandOutput = CellarSignedUrl;
