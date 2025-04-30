import { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

export interface GetMigrationCommandInput extends AddonId {
  migrationId: string;
}

export type GetMigrationCommandOutput = Migration;
