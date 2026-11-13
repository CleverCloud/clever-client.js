import type { AddonProviderId } from '../../types/cc-api.types.ts';
import type { AddonProvider } from './addon-provider.types.ts';

/**
 * Identifies the provider to retrieve. The owner is resolved automatically when omitted.
 */
export type GetAddonProviderCommandInput = AddonProviderId;

/**
 * The requested provider.
 */
export type GetAddonProviderCommandOutput = AddonProvider;
