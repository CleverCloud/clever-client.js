import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

/**
 * Identifies the log drain to retrieve, through the application or add-on it is attached to. The owner is
 * resolved automatically when omitted.
 */
export type GetLogDrainCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to retrieve. */
  drainId: string;
};

/**
 * The requested drain.
 */
export type GetLogDrainCommandOutput = LogDrain;
