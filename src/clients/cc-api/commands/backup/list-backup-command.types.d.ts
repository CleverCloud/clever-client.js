import type { AddonId } from '../../types/cc-api.types.js';
import type { Backup, BackupBase } from './backup.types.js';

export interface ListBackupCommandInput extends AddonId {
  withCommands?: boolean;
}

export type ListBackupCommandOutput = Array<Backup>;

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
