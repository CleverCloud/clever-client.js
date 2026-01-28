import { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainKind, LogDrainTarget } from './log-drain.types.js';

export type CreateLogDrainCommandInput = ApplicationId & {
  kind: LogDrainKind;
  target: LogDrainTarget;
};

export type CreateLogDrainCommandOutput = LogDrain;
