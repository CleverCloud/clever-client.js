import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * Everything a resource ends up seeing in its environment: its own variables, plus the ones the
 * applications and add-ons it is linked to contribute.
 */
export interface GetEnvironmentCommandOutput {
  /** Variables set directly on the resource, sorted by name. */
  environment: Array<EnvironmentVariable>;
  /**
   * Variables contributed by the applications this one is linked to, sorted by application name.
   * Only filled when they were asked for.
   */
  linkedApplicationsEnvironment?: Array<LinkedApplicationEnvironment>;
  /**
   * Variables contributed by the add-ons this application is linked to, sorted by add-on name.
   * Only filled when they were asked for.
   */
  linkedAddonsEnvironment?: Array<LinkedAddonEnvironment>;
}

/**
 * The variables one linked application exposes to the application being read.
 */
export interface LinkedApplicationEnvironment {
  /**
   * Identifier of the linked application.
   * @renamedFrom `app_id`
   */
  applicationId: string;
  /**
   * Display name of the linked application.
   * @renamedFrom `app_name`
   */
  applicationName: string;
  /**
   * Variables it exposes.
   * @renamedFrom `env`
   */
  environment: Array<EnvironmentVariable>;
}

/**
 * The variables one linked add-on exposes to the application being read.
 */
export interface LinkedAddonEnvironment {
  /**
   * Identifier of the linked add-on.
   * @renamedFrom `addon_id`
   */
  addonId: string;
  /**
   * Display name of the linked add-on.
   * @renamedFrom `addon_name`
   */
  addonName: string;
  /**
   * Identifier of the add-on's provider.
   * @renamedFrom `provider_id`
   */
  addonProviderId: string;
  /**
   * Variables it exposes.
   * @renamedFrom `env`
   */
  environment: Array<EnvironmentVariable>;
}
