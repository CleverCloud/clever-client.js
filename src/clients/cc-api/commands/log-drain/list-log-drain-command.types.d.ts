import { ApplicationId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type ListLogDrainCommandInput = ApplicationId & {
  status?: string;
  executionStatus?: string;
  executionStatusNotIn?: string;
};

export type ListLogDrainCommandOutput = Array<LogDrain>;
