import type { EnvironmentVariable } from '../../../../utils/environment.types.ts';
import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application, along with the full set of variables it should expose to the
 * applications linked to it.
 */
export interface UpdateExposedEnvironmentCommandInput extends ApplicationId {
  /** Variables to expose. Variables left out stop being exposed. */
  environment: Array<EnvironmentVariable>;
}
