import { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type EnableLogDrainCommandInput = ApplicationId & {
  drainId: string;
};

export type EnableLogDrainCommandOutput = LogDrain;
