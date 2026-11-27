/**
 * The details of a MySQL add-on: its version, plan, zone and status, the database it serves with the credentials to reach it, and its features.
 */
export interface MysqlInfo {
  /** Internal identifier the MySQL add-on provider assigns to the add-on (a UUID). */
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
  /** Slug of the plan the add-on was provisioned with (`dev`, `xs_sml`, …), absent when the backend has none recorded. */
  plan?: string;
  /** Name of the zone the database is hosted in. */
  zone: string;
  /** Version of MySQL the database runs (`8.4`, …). */
  version: string;
  /** Lifecycle status of the add-on on the provider side, absent when the backend has none recorded. */
  status?: MysqlStatus;
  /**
   * Date the add-on was created, as an ISO 8601 string.
   * @renamedFrom `creation_date`
   * @converted read as UTC, the backend sends it without an offset
   */
  createdAt?: string;
  /**
   * Date the add-on was deleted, as an ISO 8601 string, absent while it is not.
   * @renamedFrom `deletion_date`
   * @converted read as UTC, the backend sends it without an offset
   */
  deletedAt?: string;
  /** Host name of the MySQL server. */
  host: string;
  /** Port of the MySQL server. */
  port: number;
  /** Name of the database. */
  database: string;
  /** User name to authenticate against the database. */
  user: string;
  /** Password to authenticate against the database. */
  password: string;
  /**
   * Features of the add-on, and whether they are turned on.
   * @converted `enabled` renamed to `isEnabled`
   * @converted sorted by name
   */
  features: Array<{
    /** Name of the feature (`encryption`, `direct-host-only`). */
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
 * Lifecycle status of a MySQL add-on on the provider side.
 */
export type MysqlStatus = 'ACTIVE' | 'TO_DELETE' | 'DELETED' | 'QUOTA_EXCEEDED';
