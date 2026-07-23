import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarCredentials } from './cellar.types.js';

/**
 * Identifies the Cellar add-on whose credentials are rotated. The owner is resolved automatically
 * when omitted.
 */
export type RenewCellarCredentialsCommandInput = AddonId;

/**
 * The freshly issued S3 credentials.
 */
export type RenewCellarCredentialsCommandOutput = CellarCredentials;
