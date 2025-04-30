import { AddonId } from '../../types/cc-api.types.js';

export interface CancelMigrationCommandInput extends AddonId {
  migrationId: string;
}
