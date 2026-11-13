import type { AddonProviderId } from '../../types/cc-api.types.ts';

/**
 * Identifies the provider and the plan to remove from it.
 */
export interface DeleteAddonProviderPlanCommandInput extends AddonProviderId {
  /** Identifier of the plan to remove. */
  planId: string;
}
