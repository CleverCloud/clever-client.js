/**
 * @import { ListBackupCommandInput, ListBackupCommandOutput, ListBackupInnerCommandOutput, InnerBackup, GetAddonDetailsInnerCommandInput, GetAddonDetailsInnerCommandOutput } from './list-backup-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, omit, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetAddonCommand } from '../addon/get-addon-command.js';

/**
 * @type {{[key: string]: (addonDetails: GetAddonDetailsInnerCommandOutput) => string}}
 */
const CUSTOM_RESTORE_COMMANDS = {
  'postgresql-addon': (addonDetails) =>
    `pg_restore -h ${addonDetails.host} -p ${addonDetails.port} -U ${addonDetails.user} -d ${addonDetails.database} --no-owner --no-privileges --no-comments --format=c YOUR_BACKUP_FILE`,
  'mysql-addon': (addonDetails) =>
    `mysql -h ${addonDetails.host} -P ${addonDetails.port} -u ${addonDetails.user} -p ${addonDetails.database} < YOUR_BACKUP_FILE`,
  'mongodb-addon': (addonDetails) =>
    `mongorestore --host=${addonDetails.host} --port=${addonDetails.port} --username=${addonDetails.user} --nsFrom="${addonDetails.database}.*" --nsTo="${addonDetails.database}.*" --authenticationDatabase="${addonDetails.database}" --archive={YOUR_BACKUP_FILE} --gzip`,
};

/**
 *
 * @extends {CcApiCompositeCommand<ListBackupCommandInput, ListBackupCommandOutput>}
 * @endpoint [GET] /v2/backups/:XXX/:XXX
 * @group Backup
 * @version 2
 */
export class ListBackupCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListBackupCommandInput, ListBackupCommandOutput>['compose']} */
  async compose(params, composer) {
    const backups = await composer.send(new ListBackupInnerCommand(params));
    if (!params.withCommands || backups.length === 0) {
      return backups.map((backup) => omit(backup, 'restoreCommand', 'deleteCommand'));
    }

    // some addons may already provide the restoreCommand inside the backup payload (like es-addon)
    if (backups[0].restoreCommand != null) {
      return backups.map((backup) => ({
        ...omit(backup, 'restoreCommand', 'deleteCommand'),
        commands: {
          restoreCommand: backup.restoreCommand,
          deleteCommand: backup.deleteCommand,
        },
      }));
    }

    const addon = await composer.send(new GetAddonCommand({ addonId: params.addonId }));

    if (Object.hasOwn(CUSTOM_RESTORE_COMMANDS, addon.provider.id)) {
      const addonDetails = await composer.send(
        new GetAddonDetailsInnerCommand({ addonProviderId: addon.provider.id, addonId: addon.id }),
      );

      const restoreCommand = CUSTOM_RESTORE_COMMANDS[addon.provider.id](addonDetails);

      return backups.map((backup) => ({
        ...omit(backup, 'restoreCommand', 'deleteCommand'),
        commands: {
          restoreCommand,
          password: addonDetails.password,
          deleteCommand: backup.deleteCommand,
        },
      }));
    }

    // no restore command
    return backups.map((backup) => omit(backup, 'restoreCommand', 'deleteCommand'));
  }
}

/**
 * @extends {CcApiSimpleCommand<ListBackupCommandInput, ListBackupInnerCommandOutput>}
 * @endpoint [GET] /v2/backups/:XXX/:XXX
 * @group Backup
 * @version 2
 */
class ListBackupInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupInnerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/backups/${params.ownerId}/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<ListBackupCommandInput, ListBackupInnerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformBackup), { key: 'creationDate', order: 'desc' });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 * @param {any} payload
 * @returns {InnerBackup}
 */
function transformBackup(payload) {
  return {
    backupId: payload.backup_id,
    entityId: payload.entity_id,
    status: payload.status,
    creationDate: normalizeDate(payload.creation_date),
    expirationDate: normalizeDate(payload.delete_at),
    downloadUrl: payload.download_url ?? payload.link,
    restoreCommand: payload.restore_command,
    deleteCommand: payload.delete_command,
  };
}

/**
 *
 * @extends {CcApiSimpleCommand<GetAddonDetailsInnerCommandInput, GetAddonDetailsInnerCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/:XXX/addons/:XXX
 * @group Addon
 * @version 4
 */
class GetAddonDetailsInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetAddonDetailsInnerCommandInput, GetAddonDetailsInnerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/${params.addonProviderId}/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetAddonDetailsInnerCommandInput, GetAddonDetailsInnerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      providerId: this.params.addonProviderId,
      host: response.host,
      port: response.port,
      user: response.user,
      password: response.password,
      database: response.database,
    };
  }
}
