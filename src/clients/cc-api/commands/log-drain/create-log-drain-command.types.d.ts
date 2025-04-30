import type { LogDrain, LogDrainTarget } from './log-drain.types.js';

export type CreateLogDrainCommandInput = ({ applicationId: string } | { addonId: string }) & {
  target: LogDrainTarget;
};

export type CreateLogDrainCommandOutput = LogDrain;
