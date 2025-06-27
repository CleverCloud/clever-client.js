import type { LogDrain } from './log-drain.types.js';

export type UpdateLogDrainCommandInput = ({ applicationId: string } | { addonId: string }) & {
  drainId: string;
  state: 'ENABLED' | 'DISABLED';
};

export type UpdateLogDrainCommandOutput = LogDrain;
