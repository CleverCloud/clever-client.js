import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the add-on to deprovision. The owner is resolved automatically when omitted.
 */
export type DeleteAddonCommandInput = AddonId;
