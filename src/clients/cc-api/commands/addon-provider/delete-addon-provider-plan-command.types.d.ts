import type { AddonProviderId } from '../../types/cc-api.types.js';

export interface DeleteAddonProviderPlanCommandInput extends AddonProviderId {
  planId: string;
}
