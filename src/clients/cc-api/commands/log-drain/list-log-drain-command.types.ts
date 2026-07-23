import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain, LogDrainExecutionStatus, LogDrainStatus } from './log-drain.types.js';

export type ListLogDrainCommandInput = ApplicationOrAddonId & {
  status?: Array<LogDrainStatus>;
  executionStatus?: Array<LogDrainExecutionStatus>;
  executionStatusNotIn?: Array<LogDrainExecutionStatus>;
};

// transformed: sorted by updatedAt, most recent first
export type ListLogDrainCommandOutput = Array<LogDrain>;
