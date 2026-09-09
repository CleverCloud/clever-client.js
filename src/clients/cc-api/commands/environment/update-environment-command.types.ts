import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application, along with the full set of variables it should end up with.
 */
export interface UpdateEnvironmentCommandInput extends ApplicationId {
  /** Variables the application should end up with. Variables left out are removed. */
  environment: Array<EnvironmentVariable>;
}

/**
 * The variables on the application once the replacement went through, read from the payload's `env`
 * and sorted by name.
 */
export type UpdateEnvironmentCommandOutput = Array<EnvironmentVariable>;
