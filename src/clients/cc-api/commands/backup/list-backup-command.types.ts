import type { AddonId } from '../../types/cc-api.types.js';
import type { Backup, BackupBase } from './backup.types.js';

export interface ListBackupCommandInput extends AddonId {
  withCommands?: boolean;
}

// transformed: sorted by createdAt, most recent first
export type ListBackupCommandOutput = Array<Backup>;

// transformed: sorted by createdAt, most recent first
export type ListBackupInnerCommandOutput = Array<InnerBackup>;

export interface InnerBackup extends BackupBase {
  // renamed from restore_command
  restoreCommand?: string;
  // renamed from delete_command
  deleteCommand?: string;
}

export interface GetAddonDetailsInnerCommandInput {
  addonProviderId: string;
  addonId: string;
}

export interface GetAddonDetailsInnerCommandOutput {
  id: string;
  providerId: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
