import type { AddonId } from '../../types/cc-api.types.js';
import type { Backup, BackupBase } from './backup.types.js';

/**
 * Identifies the add-on whose backups are listed. The owner is resolved automatically when omitted.
 */
export interface ListBackupCommandInput extends AddonId {
  /**
   * Whether to also resolve the restore and delete commands. Costs up to two extra requests, and
   * yields nothing for the providers that have no restore command.
   */
  withCommands?: boolean;
}

/**
 * The backups of the add-on, sorted by creation date, most recent first.
 */
export type ListBackupCommandOutput = Array<Backup>;

/**
 * The raw backups of the add-on, sorted by creation date, most recent first.
 *
 * @internal
 */
export type ListBackupInnerCommandOutput = Array<InnerBackup>;

/**
 * A backup as the API returns it, with the commands still flattened onto the backup itself.
 *
 * @internal
 */
export interface InnerBackup extends BackupBase {
  /**
   * Command restoring the backup, when the provider builds one.
   * @renamedFrom `restore_command`
   */
  restoreCommand?: string;
  /**
   * Command deleting the backup.
   * @renamedFrom `delete_command`
   */
  deleteCommand?: string;
}

/**
 * Identifies the add-on whose connection details are fetched.
 *
 * @internal
 */
export interface GetAddonDetailsInnerCommandInput {
  /** Identifier of the add-on provider, for example `postgresql-addon`. */
  addonProviderId: string;
  /** Public identifier of the add-on. */
  addonId: string;
}

/**
 * The connection details of an add-on, used to build a restore command.
 *
 * @internal
 */
export interface GetAddonDetailsInnerCommandOutput {
  /** Identifier of the add-on. */
  id: string;
  /** Identifier of the add-on provider, echoed back from the request. */
  providerId: string;
  /** Host the add-on answers on. */
  host: string;
  /** Port the add-on listens on. */
  port: number;
  /** User name to connect with. */
  user: string;
  /** Password to connect with. */
  password: string;
  /** Name of the database to connect to. */
  database: string;
}
