import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarUrl } from './cellar.types.js';

/**
 * Identifies the Cellar add-on. The owner is resolved automatically when omitted.
 */
export type GetCellarCredentialsPresignedUrlCommandInput = AddonId;

/**
 * The presigned URL.
 */
export type GetCellarCredentialsPresignedUrlCommandOutput = CellarUrl;
