import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export interface CreateOrUpdateEnvironmentVariableCommandInput extends ApplicationId {
  name: string;
  value: string;
}

// transformed: read from the payload's env, sorted by name
export type CreateOrUpdateEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
