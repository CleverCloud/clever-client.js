import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

/**
 * Identifies the log drain to enable, through the application or add-on it is attached to. The owner is
 * resolved automatically when omitted.
 */
export type EnableLogDrainCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to enable. */
  drainId: string;
};

/**
 * The drain, once it reports that it is shipping logs again.
 */
export type EnableLogDrainCommandOutput = LogDrain;
