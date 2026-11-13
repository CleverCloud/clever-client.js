import type { AddonId } from '../../types/cc-api.types.ts';

/**
 * Identifies the add-on to deprovision. The owner is resolved automatically when omitted.
 */
export type DeleteAddonCommandInput = AddonId;
