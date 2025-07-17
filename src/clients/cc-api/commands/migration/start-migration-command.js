/**
 * @import { StartMigrationCommandInput, StartMigrationCommandOutput } from './start-migration-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformMigration } from './migration-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<StartMigrationCommandInput, StartMigrationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class StartMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<StartMigrationCommandInput, StartMigrationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations`, {
      planId: params.planId,
      region: params.zone,
      version: params.version,
    });
  }

  /** @type {CcApiSimpleCommand<StartMigrationCommandInput, StartMigrationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformMigration(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
