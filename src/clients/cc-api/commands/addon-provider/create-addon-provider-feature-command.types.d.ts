import { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeature, AddonProviderFeatureType } from './addon-provider.types.js';

export interface CreateAddonProviderFeatureCommandInput extends AddonProviderId {
  name: string;
  type: AddonProviderFeatureType;
}

export type CreateAddonProviderFeatureCommandOutput = AddonProviderFeature;
