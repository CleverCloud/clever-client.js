export interface Backup extends BackupBase {
  commands?: BackupCommands;
}

export interface BackupBase {
  // renamed from backup_id
  backupId: string;
  // renamed from entity_id
  entityId: string;
  status: string;
  // renamed from creation_date
  // transformed: converted from an ISO string with 6 digits microseconds to 3 digits milliseconds
  createdAt: string;
  // renamed from delete_at
  // transformed: converted from an ISO string with 6 digits microseconds to 3 digits milliseconds
  expiresAt?: string;
  // renamed from download_url
  // transformed: falls back to link for elasticsearch addons
  downloadUrl: string;
}

export interface BackupCommands {
  restoreCommand?: string;
  password?: string;
  deleteCommand?: string;
}
