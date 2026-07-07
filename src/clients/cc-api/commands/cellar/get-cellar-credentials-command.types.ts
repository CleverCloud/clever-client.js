import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarCredentials } from './cellar.types.js';

export type GetCellarCredentialsCommandInput = AddonId;

export type GetCellarCredentialsCommandOutput = CellarCredentials;
