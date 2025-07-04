import type { AddonProviderId } from '../../types/cc-api.types.js';
import type { AddonProviderPlan } from './addon-provider.types.js';

export interface ListAddonProviderPlanCommandInput extends AddonProviderId {}

export type ListAddonProviderPlanCommandOutput = Array<AddonProviderPlan>;
