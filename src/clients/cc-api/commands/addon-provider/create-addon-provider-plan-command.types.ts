import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderFeatureType, AddonProviderPlan } from './addon-provider.types.js';

/**
 * Identifies the provider to add a plan to, along with the plan to create.
 */
export interface CreateAddonProviderPlanCommandInput extends AddonProviderId {
  /** Display name of the plan, for example `XS Small Space`. */
  name: string;
  /** URL friendly name of the plan, unique within the provider. */
  slug: string;
  /** Monthly price of the plan. */
  price: number;
  /** Values the plan gives to the provider features. Defaults to an empty list. */
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
 * The freshly created plan.
 */
export type CreateAddonProviderPlanCommandOutput = AddonProviderPlan;
