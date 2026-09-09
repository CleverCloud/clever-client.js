import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the migration to abort. The owner is resolved automatically when omitted.
 */
export interface CancelMigrationCommandInput extends AddonId {
  /** Identifier of the migration to abort. */
  migrationId: string;
}
