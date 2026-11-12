import type { EnvironmentVariable } from '../../../../utils/environment.types.ts';
import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application, along with the variable to remove from it.
 */
export interface DeleteEnvironmentVariableCommandInput extends ApplicationId {
  /** Name of the variable to remove. */
  name: string;
}

/**
 * The variables left on the application, read from the payload's `env` and sorted by name.
 */
export type DeleteEnvironmentVariableCommandOutput = Array<EnvironmentVariable>;
