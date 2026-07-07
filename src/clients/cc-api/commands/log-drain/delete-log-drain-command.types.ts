import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type DeleteLogDrainCommandInput = ApplicationOrAddonId & {
  drainId: string;
};
