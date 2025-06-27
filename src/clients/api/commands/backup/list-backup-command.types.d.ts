import type { AddonId } from '../../types/cc-api.types.js';

export interface ListBackupCommandInput extends AddonId {}

export type ListBackupCommandOutput = Array<Backup>;

export interface Backup {
  // renamed from backup_id
  backupId: string;
  // renamed from entity_id
  entityId: string;
  status: string;
  // renamed from creation_date, transformed from iso string with 6 digits microseconds to 3 digits milliseconds
  creationDate: string;
  // renamed from delete_at, transformed from iso string with 6 digits microseconds to 3 digits milliseconds
  deleteAt: string;
  filename: string;
  // renamed from download_url
  downloadUrl: string;
}
