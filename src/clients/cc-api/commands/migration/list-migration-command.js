/**
 * @import { ListMigrationCommandInput, ListMigrationCommandOutput } from './list-migration-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformMigration } from './migration-transform.js';

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
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations`);
  }

  /** @type {CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformMigration), { key: 'requestDate', order: 'desc' });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
