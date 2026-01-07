import { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type GetLogDrainCommandInput = ApplicationId & {
  drainId: string;
};

export type GetLogDrainCommandOutput = LogDrain;
