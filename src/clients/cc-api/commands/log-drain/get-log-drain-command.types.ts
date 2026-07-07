import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type GetLogDrainCommandInput = ApplicationOrAddonId & {
  drainId: string;
};

export type GetLogDrainCommandOutput = LogDrain;
