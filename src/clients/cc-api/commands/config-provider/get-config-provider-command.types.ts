import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * Identifies the Config Provider add-on to read.
 */
export interface GetConfigProviderCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}

/**
 * The variables the add-on exposes, sorted by name.
 */
export type GetConfigProviderCommandOutput = Array<EnvironmentVariable>;
