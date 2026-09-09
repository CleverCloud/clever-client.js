import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

/**
 * A Metabase add-on: the managed business intelligence dashboard, with how to reach it and the
 * platform resources it is built on.
 */
export interface MetabaseInfo {
  /**
   * Provider-side identifier of the Metabase instance.
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
  /** Metabase version currently installed. */
  version: string;
  /** Java version Metabase runs on. */
  javaVersion: string;
  /** URL of the Metabase web interface. */
  accessUrl: string;
  /** Every version the instance can be moved to. */
  availableVersions: Array<string>;
  /** The platform resources the instance is assembled from. */
  resources: {
    /** Identifier of the application serving Metabase. */
    entrypoint: string;
    /** Identifier of the PostgreSQL add-on holding the Metabase configuration, when it has one. */
    pgsqlId?: string;
  };
  /**
   * Environment variables of the underlying application.
   * @renamedFrom `envVars`
   * @converted from a `Record<string, string>` to an array sorted by name
   */
  environment: Array<EnvironmentVariable>;
}
