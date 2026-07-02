import type { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

export type ListMigrationCommandInput = AddonId;

export type ListMigrationCommandOutput = Array<Migration>;
