import { get } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { GetAddonCommand } from '../addon/get-addon-command.js';
import { transformAddonDetails, transformBackup } from './backup-transform.js';
import type {
  GetAddonDetailsInnerCommandInput,
  GetAddonDetailsInnerCommandOutput,
  ListBackupCommandInput,
  ListBackupCommandOutput,
  ListBackupInnerCommandOutput,
} from './list-backup-command.types.js';

const CUSTOM_RESTORE_COMMANDS: { [key: string]: (addonDetails: GetAddonDetailsInnerCommandOutput) => string } = {
  'postgresql-addon': (addonDetails) =>
    `pg_restore -h ${addonDetails.host} -p ${addonDetails.port} -U ${addonDetails.user} -d ${addonDetails.database} --no-owner --no-privileges --no-comments --format=c YOUR_BACKUP_FILE`,
  'mysql-addon': (addonDetails) =>
    `mysql -h ${addonDetails.host} -P ${addonDetails.port} -u ${addonDetails.user} -p ${addonDetails.database} < YOUR_BACKUP_FILE`,
  'mongodb-addon': (addonDetails) =>
    `mongorestore --host=${addonDetails.host} --port=${addonDetails.port} --username=${addonDetails.user} --nsFrom="${addonDetails.database}.*" --nsTo="${addonDetails.database}.*" --authenticationDatabase="${addonDetails.database}" --archive={YOUR_BACKUP_FILE} --gzip`,
};

/**
 * @endpoint [GET] /v2/backups/:XXX/:XXX
 * @group Backup
 * @version 2
 */
export class ListBackupCommand extends CcApiCompositeCommand<ListBackupCommandInput, ListBackupCommandOutput> {
  async compose(params: ListBackupCommandInput, composer: CcApiComposer): Promise<ListBackupCommandOutput> {
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
 * @endpoint [GET] /v2/backups/:XXX/:XXX
 * @group Backup
 * @version 2
 */
class ListBackupInnerCommand extends CcApiSimpleCommand<ListBackupCommandInput, ListBackupInnerCommandOutput> {
  toRequestParams(params: ListBackupCommandInput) {
    return get(safeUrl`/v2/backups/${params.ownerId}/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  transformCommandOutput(response: unknown): ListBackupInnerCommandOutput {
    return sortBy((response as Array<unknown>).map(transformBackup), { key: 'creationDate', order: 'desc' });
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 * @endpoint [GET] /v4/addon-providers/:XXX/addons/:XXX
 * @group Addon
 * @version 4
 */
class GetAddonDetailsInnerCommand extends CcApiSimpleCommand<
  GetAddonDetailsInnerCommandInput,
  GetAddonDetailsInnerCommandOutput
> {
  toRequestParams(params: GetAddonDetailsInnerCommandInput) {
    return get(safeUrl`/v4/addon-providers/${params.addonProviderId}/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetAddonDetailsInnerCommandOutput {
    return transformAddonDetails(response, this.params.addonProviderId);
  }
}
