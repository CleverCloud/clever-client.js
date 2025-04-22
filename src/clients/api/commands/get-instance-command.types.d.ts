import type { ApplicationId } from '../types/cc-api.types.js';

export interface GetInstanceCommandInput extends ApplicationId {
  instanceId: string;
}

export interface GetInstanceCommandOutput {}
