import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * A Matomo add-on: the managed web analytics platform, with how to reach it and the platform
 * resources it is built on.
 */
export interface MatomoInfo {
  /**
   * Provider-side identifier of the Matomo instance.
   * @renamedFrom `resourceId`
   */
  id: string;
  /** Identifier of the add-on the instance belongs to. */
  addonId: string;
  /** Display name of the add-on. */
  name: string;
  /** Identifier of the user or organisation owning the add-on. */
  ownerId: string;
  /** Plan the instance runs on. Matomo is only offered as a beta so far. */
  plan: 'BETA';
  /** Matomo version currently installed. */
  version: string;
  /** PHP version Matomo runs on. */
  phpVersion: string;
  /** URL of the Matomo web interface. */
  accessUrl: string;
  /** Every version the instance can be moved to. */
  availableVersions: Array<string>;
  /** The platform resources the instance is assembled from. */
  resources: {
    /** Identifier of the application serving Matomo. */
    entrypoint: string;
    /** Identifier of the MySQL add-on holding the analytics data. */
    mysqlId: string;
    /** Identifier of the Redis© add-on used as a cache. */
    redisId: string;
    /** Identifier of the Materia KV add-on, on the instances that use one. */
    kvId?: string;
  };
  /**
   * Environment variables of the underlying application.
   * @renamedFrom `envVars`
   * @converted from a `Record<string, string>` to an array sorted by name
   */
  environment: Array<EnvironmentVariable>;
}
