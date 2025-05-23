/**
 * @import { GetMigrationCommandInput, GetMigrationCommandOutput } from './get-migration-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMigrationCommandInput, GetMigrationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class GetMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMigrationCommandInput, GetMigrationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/:XXX/addons/:XXX/migrations/:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetMigrationCommandInput, GetMigrationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
