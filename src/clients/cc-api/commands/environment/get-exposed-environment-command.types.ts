import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export type GetExposedEnvironmentCommandInput = ApplicationId;

export type GetExposedEnvironmentCommandOutput = Array<EnvironmentVariable>;
