import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Instance, InstanceState } from './instance.types.js';

export interface ListInstanceCommandInput extends ApplicationId {
  since?: Date | number | string;
  until?: Date | number | string;
  includeState?: Array<InstanceState>;
  excludeState?: Array<InstanceState>;
  deploymentId?: string;
  limit?: number;
  order?: 'DESC' | 'ASC';
}

export type ListInstanceCommandOutput = Array<Instance>;
