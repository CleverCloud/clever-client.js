import type { ApplicationId } from '../../types/cc-api.types.js';

export interface StreamApplicationAccessLogCommandInput extends ApplicationId {
  since?: string | number | Date;
  until?: string | number | Date;
  limit?: number;
  fields?: Array<string>;
  throttleElements?: number;
  throttlePerInMilliseconds?: number;
}
