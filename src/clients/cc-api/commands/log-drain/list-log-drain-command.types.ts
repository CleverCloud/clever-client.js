import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainExecutionStatus, LogDrainStatus } from './log-drain.types.js';

/**
 * Identifies the application or add-on whose drains are listed, and how to narrow the listing down. The owner
 * is resolved automatically when omitted.
 */
export type ListLogDrainCommandInput = ApplicationOrAddonId & {
  /** Keep only the drains in one of these statuses. */
  status?: Array<LogDrainStatus>;
  /** Keep only the drains whose shipping worker is in one of these states. */
  executionStatus?: Array<LogDrainExecutionStatus>;
  /** Drop the drains whose shipping worker is in one of these states. */
  executionStatusNotIn?: Array<LogDrainExecutionStatus>;
};

/**
 * The matching drains. Sorted by last status change, most recent first.
 */
export type ListLogDrainCommandOutput = Array<LogDrain>;
