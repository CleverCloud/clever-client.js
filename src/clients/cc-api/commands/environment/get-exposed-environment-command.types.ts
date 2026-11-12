import type { EnvironmentVariable } from '../../../../utils/environment.types.ts';
import type { ApplicationId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application whose exposed configuration is read. The owner is resolved
 * automatically when omitted.
 */
export type GetExposedEnvironmentCommandInput = ApplicationId;

/**
 * The variables this application hands to the applications linked to it.
 * @converted from a `Record<string, string>` to an array
 * @converted sorted by name
 */
export type GetExposedEnvironmentCommandOutput = Array<EnvironmentVariable>;
