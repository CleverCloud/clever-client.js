import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type EnableLogDrainCommandInput = ApplicationOrAddonId & {
  drainId: string;
};

export type EnableLogDrainCommandOutput = LogDrain;
