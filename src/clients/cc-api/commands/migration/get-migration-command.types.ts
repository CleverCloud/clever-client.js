import type { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

/**
 * Identifies the migration to retrieve. The owner is resolved automatically when omitted.
 */
export interface GetMigrationCommandInput extends AddonId {
  /** Identifier of the migration to retrieve. */
  migrationId: string;
}

/**
 * The requested migration, with its steps.
 */
export type GetMigrationCommandOutput = Migration;
