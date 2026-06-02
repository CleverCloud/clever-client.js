import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export interface GetExposedEnvironmentCommandInput extends ApplicationId {}

export type GetExposedEnvironmentCommandOutput = Array<EnvironmentVariable>;
