import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderPlan } from './addon-provider.types.js';

export type ListAddonProviderPlanCommandInput = AddonProviderId;

export type ListAddonProviderPlanCommandOutput = Array<AddonProviderPlan>;
