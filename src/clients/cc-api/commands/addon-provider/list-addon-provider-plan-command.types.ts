import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderPlan } from './addon-provider.types.js';

export type ListAddonProviderPlanCommandInput = AddonProviderId;

// transformed: sorted by price, then name
export type ListAddonProviderPlanCommandOutput = Array<AddonProviderPlan>;
