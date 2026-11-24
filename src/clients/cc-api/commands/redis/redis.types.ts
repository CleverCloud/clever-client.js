/**
 * The details of a Redis add-on: its version, plan, zone, status and role, the port it listens on, and its features.
 * Carries no host nor password: the provider leaves the credentials out of this view.
 */
export interface RedisInfo {
  /** Internal identifier the Redis add-on provider assigns to the add-on (a UUID). */
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
  /** Name of the plan the add-on was provisioned with (`DEV`, `S_MONO`, …). */
  plan: string;
  /** Name of the zone the database is hosted in. */
  zone: string;
  /** Version of Redis the database runs (`8.10.3`, …). */
  version: string;
  /** Lifecycle status of the add-on on the provider side. */
  status: RedisStatus;
  /** Replication role of the database. */
  role: RedisRole;
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
  /** Port the Redis server listens on. */
  port: number;
  /**
   * Features of the add-on, and whether they are turned on.
   * @converted `enabled` renamed to `isEnabled`
   * @converted sorted by name
   */
  features: Array<{
    /** Name of the feature (`encryption`). */
    name: string;
    /** Whether the feature is turned on for this add-on. */
    isEnabled: boolean;
  }>;
}

/**
 * Lifecycle status of a Redis add-on on the provider side.
 */
export type RedisStatus = 'ACTIVE' | 'TO_DELETE' | 'DELETED';

/**
 * Replication role of a Redis database.
 */
export type RedisRole = 'none' | 'master' | 'slave' | 'pool';
