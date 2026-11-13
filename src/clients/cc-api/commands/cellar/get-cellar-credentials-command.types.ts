import type { AddonId } from '../../types/cc-api.types.ts';
import type { CellarCredentials } from './cellar.types.ts';

/**
 * Identifies the Cellar add-on whose credentials are read. The owner is resolved automatically when
 * omitted.
 */
export type GetCellarCredentialsCommandInput = AddonId;

/**
 * The S3 credentials to point an S3 client at.
 */
export type GetCellarCredentialsCommandOutput = CellarCredentials;
