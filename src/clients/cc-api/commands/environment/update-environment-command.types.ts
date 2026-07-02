import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export interface UpdateEnvironmentCommandInput extends ApplicationId {
  environment: Array<EnvironmentVariable>;
}

export type UpdateEnvironmentCommandOutput = Array<EnvironmentVariable>;
