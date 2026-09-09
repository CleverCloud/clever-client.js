/**
 * Identifies the add-on whose version is checked.
 */
export type CheckKeycloakVersionCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
};

/**
 * Where the instance stands with respect to the versions the platform offers.
 */
export type CheckKeycloakVersionCommandOutput = {
  /** Version currently installed. */
  installed: string;
  /**
   * Every version the instance can be moved to.
   * @renamedFrom `available`
   */
  availableVersions: Array<string>;
  /** Newest version on offer. */
  latest: string;
  /** Whether a newer version than the installed one is available. */
  needUpdate: boolean;
};
