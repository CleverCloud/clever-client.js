import type { EnvironmentVariable } from '../../../../utils/environment.types.js';
import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application, along with the variable to set on it.
 */
export interface CreateOrUpdateEnvironmentVariableCommandInput extends ApplicationId {
  /** Name of the variable. Created when it does not exist yet, overwritten when it does. */
  name: string;
  /** Value to store. */
  value: string;
}

/**
 * Every variable of the application once the change went through, read from the payload's `env` and
 * sorted by name.
 */
export type CreateOrUpdateEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
