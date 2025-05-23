/**
 * @import { ListMigrationCommandInput, ListMigrationCommandOutput } from './list-migration-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class ListMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/:XXX/addons/:XXX/migrations`);
  }

  /** @type {CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
