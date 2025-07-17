import { AddonId } from '../../types/cc-api.types.js';
import type { Migration } from './migration.types.js';

export interface StartMigrationCommandInput extends AddonId {
  planId: string;
  zone: string;
  version: string;
}

export type StartMigrationCommandOutput = Migration;
