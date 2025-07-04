import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeatureType, AddonProviderPlan } from './addon-provider.types.js';

export interface CreateAddonProviderPlanCommandInput extends AddonProviderId {
  name: string;
  slug: string;
  price: number;
  features?: Array<{
    name: string;
    type: AddonProviderFeatureType;
    value: string;
  }>;
}

export type CreateAddonProviderPlanCommandOutput = AddonProviderPlan;
