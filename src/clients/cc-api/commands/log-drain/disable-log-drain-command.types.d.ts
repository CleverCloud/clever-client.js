import { ApplicationId } from '../../types/cc-api.types.js';

export type DisableLogDrainCommandInput = ApplicationId & {
  drainId: string;
};
