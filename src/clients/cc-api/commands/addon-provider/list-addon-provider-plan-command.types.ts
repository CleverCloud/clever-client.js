import type { AddonProviderId } from '../../types/cc-api.types.ts';
import type { AddonProviderPlan } from './addon-provider.types.ts';

/**
 * Identifies the provider whose plans are listed. The owner is resolved automatically when omitted.
 */
export type ListAddonProviderPlanCommandInput = AddonProviderId;

/**
 * The plans offered by the provider, sorted by price then by name.
 */
export type ListAddonProviderPlanCommandOutput = Array<AddonProviderPlan>;
