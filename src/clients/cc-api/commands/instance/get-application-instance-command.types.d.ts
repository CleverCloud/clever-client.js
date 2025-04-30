import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Instance } from './instance.types.js';

export interface GetApplicationInstanceCommandInput extends ApplicationId {
  instanceId: string;
}

export type GetApplicationInstanceCommandOutput = Instance;
