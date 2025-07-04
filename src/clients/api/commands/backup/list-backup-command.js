/**
 * @import { ListBackupCommandInput, ListBackupCommandOutput } from './list-backup-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformBackup } from './backup-transform.js';

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

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformBackup);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
