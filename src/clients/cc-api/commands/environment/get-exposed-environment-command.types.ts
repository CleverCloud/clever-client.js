import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

export type GetExposedEnvironmentCommandInput = ApplicationId;

// transformed: converted from a Record<string, string> to an array, sorted by name
export type GetExposedEnvironmentCommandOutput = Array<EnvironmentVariable>;
