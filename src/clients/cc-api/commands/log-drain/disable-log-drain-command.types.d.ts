import type { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type DisableLogDrainCommandInput = ApplicationId & {
  drainId: string;
};

export type DisableLogDrainCommandOutput = LogDrain;
