import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainKind, LogDrainTarget } from './log-drain.types.js';

export type CreateLogDrainCommandInput = ApplicationOrAddonId & {
  kind: LogDrainKind;
  target: LogDrainTarget;
  /**
   * By default, the API probes the target before creating the drain.
   * Set to `true` to skip this connectivity check (e.g. when the target isn't reachable yet, like in IaC flows).
   */
  skipCheck?: boolean;
};

export type CreateLogDrainCommandOutput = LogDrain;
