import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeatureType, AddonProviderPlan } from './addon-provider.types.js';

/**
 * Identifies the plan to update, along with its new values.
 */
export interface UpdateAddonProviderPlanCommandInput extends AddonProviderId {
  /** Identifier of the plan to update. */
  planId: string;
  /** New display name of the plan. */
  name: string;
  /** New URL friendly name of the plan. */
  slug: string;
  /** New monthly price of the plan. */
  price: number;
  /** New values the plan gives to the provider features. Features left out keep their current value. */
  features?: Array<{
    /** Display name of the feature, as declared on the provider. */
    name: string;
    /** How the value should be interpreted and formatted. */
    type: AddonProviderFeatureType;
    /** Value this plan gives to the feature, for example `4 GB`. */
    value: string;
  }>;
}

/**
 * The plan as it stands after the update.
 */
export type UpdateAddonProviderPlanCommandOutput = AddonProviderPlan;
