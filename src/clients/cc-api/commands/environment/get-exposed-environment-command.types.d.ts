import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import { ApplicationId } from '../../types/cc-api.types.js';

export interface GetExposedEnvironmentCommandInput extends ApplicationId {}

export type GetExposedEnvironmentCommandOutput = Array<EnvironmentVariable>;
