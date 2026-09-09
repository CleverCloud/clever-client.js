import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

/**
 * Identifies the log drain whose cursor is reset, through the application or add-on it is attached to. The
 * owner is resolved automatically when omitted.
 */
export type ResetLogDrainCursorCommandInput = ApplicationOrAddonId & {
  /** Identifier of the drain whose cursor is reset. */
  drainId: string;
};

/**
 * The drain, once its cursor has been moved to now.
 */
export type ResetLogDrainCursorCommandOutput = LogDrain;
