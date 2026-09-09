/**
 * A migration of an add-on to another plan, zone or version: a sequence of steps the add-on provider runs to move
 * the data and to switch the traffic over.
 */
export interface Migration {
  /**
   * Identifier of the migration.
   * @renamedFrom `migrationId`
   */
  id: string;
  /**
   * When the migration was asked for.
   * @renamedFrom `requestDate`
   * @converted to an ISO date string
   */
  requestedAt: string;
  /** The steps the migration goes through, in the order the provider runs them. */
  steps: Array<MigrationStep>;
  /** Where the migration as a whole stands. */
  status: MigrationStatus;
}

/**
 * One step of a migration, and how it went.
 */
export interface MigrationStep {
  /** What the step does. */
  value: MigrationStepType;
  /** Where the step stands. */
  status: MigrationStatus;
  /**
   * When the step started.
   * @renamedFrom `startDate`
   * @converted to an ISO date string
   */
  startsAt: string;
  /**
   * When the step finished. Absent while it is still running.
   * @renamedFrom `endDate`
   * @converted to an ISO date string
   */
  endsAt?: string;
  /** Details reported by the step, typically the reason it failed. */
  message?: string;
}

/**
 * The steps an add-on migration can go through, from inspecting the source add-on to switching DNS and monitoring
 * over to the new one.
 */
export type MigrationStepType =
  | 'RETRIEVE_ADDON'
  | 'RETRIEVE_ADDON_DEPLOYMENT'
  | 'CHECK_NO_MIGRATION_ALREADY_RUNNING_FOR_ADDON'
  | 'RETRIEVE_SOURCE_CLUSTER'
  | 'RETRIEVE_TARGET_CLUSTER'
  | 'PRE_MIGRATION_ACTIONS'
  | 'REMOVE_EDIT_RIGHT'
  | 'MANAGE_ACTIVE_EXTENSIONS'
  | 'ENABLE_EDIT_RIGHT'
  | 'CHANGE_ADDON_QUOTA'
  | 'RETRIEVE_LOGSCOLLECTOR'
  | 'RETRIEVE_NEXT_AVAILABLE_PORT'
  | 'CREATE_ADDON_ON_TARGET_CLUSTER'
  | 'ASK_MIGRATION_INSTANCE_BOOT'
  | 'QUEUE_MIGRATION_INSTANCE_BOOT'
  | 'DEPLOY_MIGRATION_INSTANCE'
  | 'PREPARE_MIGRATION'
  | 'DUMP_AND_RESTORE'
  | 'REMOVE_ADDON_FROM_SOURCE_CLUSTER'
  | 'REMOVE_ADDON_FROM_TARGET_CLUSTER'
  | 'RETRIEVE_SOURCE_INSTANCE'
  | 'RETRIEVE_MIGRATION_INSTANCE'
  | 'STOP_MIGRATION_INSTANCE'
  | 'STOP_SOURCE_INSTANCE'
  | 'UPDATE_REVERSE_PROXIES'
  | 'UPDATE_DNS'
  | 'UPDATE_MONITORING'
  | 'UPDATE_ADDON'
  | 'LOCK_PORT'
  | 'UNLOCK_PORT';

/**
 * Where a migration, or one of its steps, stands: still going, finished, or rolled back after a failure.
 */
export type MigrationStatus = 'ABORTED' | 'RUNNING' | 'FAILED' | 'RECOVERING' | 'RECOVERED' | 'OK';
