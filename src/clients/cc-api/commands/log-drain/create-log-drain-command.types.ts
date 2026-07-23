import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainKind, LogDrainTarget } from './log-drain.types.js';

/**
 * Identifies the application or add-on the drain is created on, and describes the drain to create. The owner
 * is resolved automatically when omitted.
 */
export type CreateLogDrainCommandInput = ApplicationOrAddonId & {
  /** Which stream of logs the drain ships. */
  kind: LogDrainKind;
  /**
   * Where the drain ships the logs, and how it authenticates against it.
   * @sentAs `recipient`
   */
  target: LogDrainTarget;
  /**
   * By default, the API probes the target before creating the drain.
   * Set to `true` to skip this connectivity check (e.g. when the target isn't reachable yet, like in IaC flows).
   */
  skipCheck?: boolean;
};

/**
 * The created drain, once it reports that it is shipping logs.
 */
export type CreateLogDrainCommandOutput = LogDrain;
