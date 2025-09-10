import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import { ApplicationId } from '../../types/cc-api.types.js';

export interface UpdateExposedEnvironmentCommandInput extends ApplicationId {
  environment: Array<EnvironmentVariable>;
}
