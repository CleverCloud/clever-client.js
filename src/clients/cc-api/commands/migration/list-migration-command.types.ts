import type { AddonId } from '../../types/cc-api.types.ts';
import type { Migration } from './migration.types.ts';

/**
 * Identifies the add-on whose migrations are listed. The owner is resolved automatically when omitted.
 */
export type ListMigrationCommandInput = AddonId;

/**
 * The migrations of the add-on. Sorted by request date, most recent first.
 */
export type ListMigrationCommandOutput = Array<Migration>;
