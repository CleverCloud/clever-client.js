/**
 * @import { UpdateMigrationCommandInput, UpdateMigrationCommandOutput } from './update-migration-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateMigrationCommandInput, UpdateMigrationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class UpdateMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateMigrationCommandInput, UpdateMigrationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/:XXX/addons/:XXX/migrations`, {});
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID', // ???
    };
  }
}
