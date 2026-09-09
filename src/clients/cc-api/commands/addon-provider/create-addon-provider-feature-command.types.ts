import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeature, AddonProviderFeatureType } from './addon-provider.types.js';

/**
 * Identifies the provider to add a feature to, along with the feature to declare.
 */
export interface CreateAddonProviderFeatureCommandInput extends AddonProviderId {
  /** Display name of the feature, for example `Memory`. */
  name: string;
  /** How the values plans give to this feature should be interpreted and formatted. */
  type: AddonProviderFeatureType;
}

/**
 * The freshly declared feature.
 */
export type CreateAddonProviderFeatureCommandOutput = AddonProviderFeature;
