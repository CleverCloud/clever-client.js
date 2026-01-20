import { ApplicationId } from '../../types/cc-api.types.js';

export type DeleteLogDrainCommandInput = ApplicationId & {
  drainId: string;
};

export type DeleteLogDrainCommandOutput = void;
