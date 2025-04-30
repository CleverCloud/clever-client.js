import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProvider } from './addon-provider.types.js';

export interface UpdateAddonProviderCommandInput extends AddonProviderId {
  name?: string;
  website?: string;
  supportEmail?: string;
  googlePlusName?: string;
  twitterName?: string;
  analyticsId?: string;
  shortDesc?: string;
  longDesc?: string;
  logoUrl?: string;
}

export type UpdateAddonProviderCommandOutput = AddonProvider;
