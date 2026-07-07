import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { LogDrain } from './log-drain.types.js';

export type DisableLogDrainCommandInput = ApplicationOrAddonId & {
  drainId: string;
};

export type DisableLogDrainCommandOutput = LogDrain;
