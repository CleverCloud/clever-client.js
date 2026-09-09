import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the log drain to build a test command for, through the application or add-on it is attached to.
 * The owner is resolved automatically when omitted.
 */
export type GetLogDrainTestCommandCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain to build a test command for. */
  drainId: string;
};

/**
 * A ready-to-run shell command that sends a sample payload to the drain's recipient.
 */
export type GetLogDrainTestCommandCommandOutput = string;
