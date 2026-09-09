import type { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

/**
 * Describes the migration to start on an add-on. The owner is resolved automatically when omitted.
 */
export interface StartMigrationCommandInput extends AddonId {
  /** Identifier of the plan to migrate the add-on to. */
  planId: string;
  /**
   * Name of the zone to migrate the add-on to.
   * @sentAs `region`
   */
  zone: string;
  /** Version of the add-on to migrate to. */
  version: string;
}

/**
 * The migration that was started, with the steps it is about to go through.
 */
export type StartMigrationCommandOutput = Migration;
