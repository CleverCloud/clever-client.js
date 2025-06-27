/**
 * @import { ListBackupCommandInput, ListBackupCommandOutput } from './list-backup-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>}
 * @endpoint [GET] /v2/backups/:XXX/:XXX
 * @group Backup
 * @version 2
 */
export class ListBackupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/backups/${params.ownerId}/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }

  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(
      /** @param {any} backup */ (backup) => ({
        backupId: backup.backup_id,
        entityId: backup.entity_id,
        status: backup.status,
        creationDate: new Date(backup.creation_date).toISOString(),
        deleteAt: new Date(backup.delete_at).toISOString(),
        filename: backup.filename,
        downloadUrl: backup.download_url,
      }),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
