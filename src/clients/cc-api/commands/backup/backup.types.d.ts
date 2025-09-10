export interface Backup extends BackupBase {
  commands?: BackupCommands;
}

export interface BackupBase {
  // renamed from backup_id
  backupId: string;
  // renamed from entity_id
  entityId: string;
  status: string;
  // renamed from creation_date, transformed from iso string with 6 digits microseconds to 3 digits milliseconds
  creationDate: string;
  // renamed from delete_at, transformed from iso string with 6 digits microseconds to 3 digits milliseconds
  expirationDate?: string;
  // renamed from download_url (or from link for elasticsearch addons)
  downloadUrl: string;
}

export interface BackupCommands {
  restoreCommand?: string;
  password?: string;
  deleteCommand?: string;
}
