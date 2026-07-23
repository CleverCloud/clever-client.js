import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * Identifies the Config Provider add-on, along with the full set of variables it should expose.
 */
export interface UpdateConfigProviderCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
  /**
   * Variables the add-on should expose. Those left out are removed.
   * @sentAs the whole request body
   */
  environment: Array<EnvironmentVariable>;
}

/**
 * The variables the add-on exposes once the replacement went through, sorted by name.
 */
export type UpdateConfigProviderCommandOutput = Array<EnvironmentVariable>;
