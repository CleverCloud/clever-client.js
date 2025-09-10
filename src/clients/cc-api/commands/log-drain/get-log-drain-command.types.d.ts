import type { LogDrain } from './log-drain.types.js';

export type GetLogDrainCommandInput = ({ applicationId: string } | { addonId: string }) & {
  drainId: string;
};

export type GetLogDrainCommandOutput = LogDrain;
