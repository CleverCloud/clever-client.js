import type { AddonProviderId } from '../../types/cc-api.types.js';

export interface DeleteAddonProviderFeatureCommandInput extends AddonProviderId {
  name: string;
}
