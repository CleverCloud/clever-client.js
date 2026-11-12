import type { AddonId } from '../../types/cc-api.types.ts';
import type { CellarUrl } from './cellar.types.ts';

/**
 * Identifies the Cellar add-on. The owner is resolved automatically when omitted.
 */
export type GetCellarCredentialsPresignedUrlCommandInput = AddonId;

/**
 * The presigned URL.
 */
export type GetCellarCredentialsPresignedUrlCommandOutput = CellarUrl;
