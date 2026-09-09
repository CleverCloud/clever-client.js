import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the log drain to delete, through the application or add-on it is attached to. The owner is
 * resolved automatically when omitted.
 */
export type DeleteLogDrainCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to delete. */
  drainId: string;
};
