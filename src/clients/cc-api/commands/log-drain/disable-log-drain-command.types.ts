import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

/**
 * Identifies the log drain to disable, through the application or add-on it is attached to. The owner is
 * resolved automatically when omitted.
 */
export type DisableLogDrainCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to disable. */
  drainId: string;
};

/**
 * The drain, once it reports that it has stopped shipping logs.
 */
export type DisableLogDrainCommandOutput = LogDrain;
