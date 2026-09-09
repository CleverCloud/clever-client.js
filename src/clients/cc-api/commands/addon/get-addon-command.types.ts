import type { AddonId } from '../../types/cc-api.types.js';
import type { Addon } from './addon.types.js';

/**
 * Identifies the add-on to retrieve. The owner is resolved automatically when omitted.
 */
export type GetAddonCommandInput = AddonId;

/**
 * The requested add-on.
 */
export type GetAddonCommandOutput = Addon;
