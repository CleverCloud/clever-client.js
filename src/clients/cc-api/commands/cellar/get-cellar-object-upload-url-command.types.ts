import type { CellarObjectResourceId, CellarUrl } from './cellar.types.js';

/**
 * Identifies the object key to mint an upload URL for.
 */
export type GetCellarObjectUploadUrlCommandInput = CellarObjectResourceId;

/**
 * The presigned upload URL.
 */
export type GetCellarObjectUploadUrlCommandOutput = CellarUrl;
