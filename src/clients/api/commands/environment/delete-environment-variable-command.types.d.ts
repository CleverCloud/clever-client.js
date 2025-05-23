import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import { ApplicationId } from '../../types/cc-api.types.js';

export interface DeleteEnvironmentVariableCommandInput extends ApplicationId {
  name: string;
}

export type DeleteEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
