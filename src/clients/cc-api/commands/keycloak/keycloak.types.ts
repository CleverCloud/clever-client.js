import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * A Keycloak add-on: the managed identity and access management server, with how to reach it and
 * the platform resources it is built on.
 */
export interface KeycloakInfo {
  /**
   * Provider-side identifier of the Keycloak instance.
   * @renamedFrom `resourceId`
   */
  id: string;
  /** Identifier of the add-on the instance belongs to. */
  addonId: string;
  /** Display name of the add-on. */
  name: string;
  /** Identifier of the user or organisation owning the add-on. */
  ownerId: string;
  /** Plan the instance runs on. */
  plan: string;
  /** Keycloak version currently installed. */
  version: string;
  /** Java version Keycloak runs on. */
  javaVersion: string;
  /** URL of the Keycloak administration console. */
  accessUrl: string;
  /** Credentials of the first administrator, handed over once at provisioning time. */
  initialCredentials: {
    /** Administrator user name. */
    user: string;
    /** Administrator password. */
    password: string;
  };
  /** Every version the instance can be moved to. */
  availableVersions: string[];
  /** The platform resources the instance is assembled from. */
  resources: {
    /** Identifier of the application serving Keycloak. */
    entrypoint: string;
    /** Identifier of the FS Bucket add-on holding the instance's files. */
    fsbucketId: string;
    /** Identifier of the PostgreSQL add-on holding the realm data. */
    pgsqlId: string;
  };
  /** Optional capabilities turned on for this instance. */
  features: {
    /** The network group the instance sits behind, when it is not publicly reachable. */
    networkGroup?: {
      /** Identifier of the network group. */
      id: string;
    };
  };
  /**
   * Environment variables of the underlying application.
   * @renamedFrom `envVars`
   * @converted from a `Record<string, string>` to an array sorted by name
   */
  environment: Array<EnvironmentVariable>;
}
