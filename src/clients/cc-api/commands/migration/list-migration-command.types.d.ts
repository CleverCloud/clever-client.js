import { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

export interface ListMigrationCommandInput extends AddonId {}

export type ListMigrationCommandOutput = Array<Migration>;
