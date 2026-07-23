import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export interface DeleteEnvironmentVariableCommandInput extends ApplicationId {
  name: string;
}

// transformed: read from the payload's env, sorted by name
export type DeleteEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
