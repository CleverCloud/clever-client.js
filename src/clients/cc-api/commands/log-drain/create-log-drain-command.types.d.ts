import { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainTarget } from './log-drain.types.js';

export type CreateLogDrainCommandInput = ApplicationId & {
  target: LogDrainTarget;
};

export type CreateLogDrainCommandOutput = LogDrain;
