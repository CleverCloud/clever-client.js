import type { AddonId } from '../../types/cc-api.types.js';

export interface StreamAddonRuntimeLogCommandInput extends AddonId {
  since?: string | number | Date;
  until?: string | number | Date;
  limit?: number;
  deploymentId?: string;
  filter?: string;
  instanceId?: Array<string>;
  field?: Array<string>;
  throttleElements?: number;
  throttlePerInMilliseconds?: number;
}
