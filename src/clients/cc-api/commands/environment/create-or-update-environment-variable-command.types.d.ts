import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import { ApplicationId } from '../../types/cc-api.types.js';

export interface CreateOrUpdateEnvironmentVariableCommandInput extends ApplicationId {
  name: string;
  value: string;
}

export type CreateOrUpdateEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
