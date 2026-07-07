import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarCredentials } from './cellar.types.js';

export type RenewCellarCredentialsCommandInput = AddonId;

export type RenewCellarCredentialsCommandOutput = CellarCredentials;
