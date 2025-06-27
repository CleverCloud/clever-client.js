import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Instance } from './instance.types.js';

export interface GetInstanceCommandInput extends ApplicationId {
  instanceId: string;
}

export type GetInstanceCommandOutput = Instance;
