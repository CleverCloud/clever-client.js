/**
 * The details of a PostgreSQL add-on: its version, plan, zone and status, the database it serves with the credentials to reach it, and its features.
 */
export interface PostgresqlInfo {
  /** Internal identifier the PostgreSQL add-on provider assigns to the add-on (a UUID). */
  id: string;
  /**
   * Identifier of the add-on the database was provisioned for.
   * @renamedFrom `app_id`
   */
  addonId: string;
  /**
   * Identifier of the organisation owning the add-on, absent when the backend has none recorded.
   * @renamedFrom `owner_id`
   */
  ownerId?: string;
  /** Slug of the plan the add-on was provisioned with (`dev`, `xs_sml`, …). */
  plan: string;
  /** Name of the zone the database is hosted in. */
  zone: string;
  /** Version of PostgreSQL the database runs (`17`, …). */
  version: string;
  /** Lifecycle status of the add-on on the provider side. */
  status: PostgresqlStatus;
  /**
   * Date the add-on was created, as an ISO 8601 string.
   * @renamedFrom `creation_date`
   */
  createdAt: string;
  /**
   * Date the add-on was deleted, as an ISO 8601 string, absent while it is not.
   * @renamedFrom `deletion_date`
   */
  deletedAt?: string;
  /** Host name of the PostgreSQL server. */
  host: string;
  /** Port of the PostgreSQL server. */
  port: number;
  /** Name of the database. */
  database: string;
  /** User name to authenticate against the database. */
  user: string;
  /** Password to authenticate against the database. */
  password: string;
  /** Locale the database was created with (`en_GB`, …), absent for an add-on on a shared plan. */
  locale?: string;
  /**
   * Features of the add-on, and whether they are turned on.
   * @converted `enabled` renamed to `isEnabled`
   * @converted sorted by name
   */
  features: Array<{
    /** Name of the feature (`encryption`, `direct-host-only`, `do-backup`). */
    name: string;
    /** Whether the feature is turned on for this add-on. */
    isEnabled: boolean;
  }>;
  /**
   * Additional users allowed to read the database but not to write to it.
   * @renamedFrom `read_only_users`
   * @converted sorted by user name
   */
  readOnlyUsers: Array<{
    /** User name of the read-only user. */
    user: string;
    /** Password of the read-only user. */
    password: string;
  }>;
}

/**
 * Lifecycle status of a PostgreSQL add-on on the provider side.
 */
export type PostgresqlStatus = 'ACTIVE' | 'TO_DELETE' | 'DELETED' | 'QUOTA_EXCEEDED';
