import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeature } from './addon-provider.types.js';

/**
 * Identifies the provider whose features are listed. The owner is resolved automatically when omitted.
 */
export type ListAddonProviderFeatureCommandInput = AddonProviderId;

/**
 * The features declared by the provider, sorted by name.
 */
export type ListAddonProviderFeatureCommandOutput = Array<AddonProviderFeature>;
