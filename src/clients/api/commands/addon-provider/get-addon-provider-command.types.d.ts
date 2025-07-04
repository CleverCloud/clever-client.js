import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProvider } from './addon-provider.types.js';

export interface GetAddonProviderCommandInput extends AddonProviderId {}

export type GetAddonProviderCommandOutput = AddonProvider;
