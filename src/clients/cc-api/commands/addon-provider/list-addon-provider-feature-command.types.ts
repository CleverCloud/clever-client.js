import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeature } from './addon-provider.types.js';

export interface ListAddonProviderFeatureCommandInput extends AddonProviderId {}

export type ListAddonProviderFeatureCommandOutput = Array<AddonProviderFeature>;
