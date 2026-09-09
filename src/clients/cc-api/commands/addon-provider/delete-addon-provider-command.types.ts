import type { AddonProviderId } from '../../types/cc-api.types.js';

/**
 * Identifies the provider to remove. The owner is resolved automatically when omitted.
 */
export type DeleteAddonProviderCommandInput = AddonProviderId;
