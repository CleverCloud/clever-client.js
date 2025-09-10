import type { LogDrain } from './log-drain.types.js';

export type ListLogDrainCommandInput = { applicationId: string } | { addonId: string };

export type ListLogDrainCommandOutput = Array<LogDrain>;
