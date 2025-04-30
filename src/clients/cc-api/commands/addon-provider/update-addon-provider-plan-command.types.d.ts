import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeatureType, AddonProviderPlan } from './addon-provider.types.js';

export interface UpdateAddonProviderPlanCommandInput extends AddonProviderId {
  planId: string;
  name: string;
  slug: string;
  price: number;
  features?: Array<{
    name: string;
    type: AddonProviderFeatureType;
    value: string;
  }>;
}

export type UpdateAddonProviderPlanCommandOutput = AddonProviderPlan;
