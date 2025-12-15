import { ApplicationId } from '../../types/cc-api.types.js';

export type ResetLogDrainCursorCommandInput = ApplicationId & {
  drainId: string;
};
