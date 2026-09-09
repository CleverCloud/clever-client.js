import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrainProbeResult } from './log-drain.types.js';

/**
 * Identifies the log drain to probe, through the application or add-on it is attached to. The owner is
 * resolved automatically when omitted.
 */
export type CheckLogDrainCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to probe. */
  drainId: string;
};

/**
 * The outcome of the probe.
 */
export type CheckLogDrainCommandOutput = LogDrainProbeResult;
