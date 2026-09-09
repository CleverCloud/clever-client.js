import type { AddonProviderId } from '../../types/cc-api.types.js';

/**
 * Identifies the provider and the feature to remove from it.
 */
export interface DeleteAddonProviderFeatureCommandInput extends AddonProviderId {
  /** Display name of the feature to remove, as declared. Base64-encoded before being sent. */
  name: string;
}
