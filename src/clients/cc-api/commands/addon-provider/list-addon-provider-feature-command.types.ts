import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeature } from './addon-provider.types.js';

export type ListAddonProviderFeatureCommandInput = AddonProviderId;

// transformed: sorted by name
export type ListAddonProviderFeatureCommandOutput = Array<AddonProviderFeature>;
