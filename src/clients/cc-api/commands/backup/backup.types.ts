/**
 * A backup taken from an add-on, along with the shell commands that restore or delete it when the
 * caller asked for them.
 */
export interface Backup extends BackupBase {
  /** Shell commands operating on this backup. Only filled when the command was asked for them. */
  commands?: BackupCommands;
}

/**
 * A backup taken from an add-on: a downloadable snapshot of its data at a point in time.
 */
export interface BackupBase {
  /**
   * Identifier of the backup.
   * @renamedFrom `backup_id`
   */
  backupId: string;
  /**
   * Provider-side identifier of the add-on the backup was taken from.
   * @renamedFrom `entity_id`
   */
  entityId: string;
  /** Where the backup stands, for example whether it completed. */
  status: string;
  /**
   * When the backup was taken.
   * @renamedFrom `creation_date`
   * @converted from an ISO string with 6 digits microseconds to 3 digits milliseconds
   */
  createdAt: string;
  /**
   * When the backup will be dropped by the retention policy.
   * @renamedFrom `delete_at`
   * @converted from an ISO string with 6 digits microseconds to 3 digits milliseconds
   */
  expiresAt?: string;
  /**
   * URL the backup archive can be downloaded from.
   * @renamedFrom `download_url`
   * @converted falls back to `link` for Elasticsearch add-ons
   */
  downloadUrl: string;
  /**
   * Name of the backup archive file, for example `<ref>-<timestamp>.<ext>`. Only sent for
   * database add-ons; Elasticsearch backups do not carry it.
   */
  filename?: string;
}

/**
 * The shell commands operating on a backup, ready to be copied into a terminal.
 */
export interface BackupCommands {
  /** Command restoring the backup into the add-on, with a placeholder for the downloaded file. */
  restoreCommand?: string;
  /** Password the restore command asks for, when the add-on exposes one. */
  password?: string;
  /** Command deleting the backup. */
  deleteCommand?: string;
}
