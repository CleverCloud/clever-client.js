/**
 * @import { ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput } from './list-migration-preorder-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations/preorders
 * @group Migration
 * @version 2
 */
export class ListMigrationPreorderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/:XXX/addons/:XXX/migrations/preorders`);
  }

  /** @type {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID', //???
    };
  }
}
