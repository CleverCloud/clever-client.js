import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { ListMigrationCommandInput, ListMigrationCommandOutput } from './list-migration-command.types.js';
import { transformMigration } from './migration-transform.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class ListMigrationCommand extends CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput> {
  toRequestParams(params: ListMigrationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations`);
  }

  transformCommandOutput(response: unknown): ListMigrationCommandOutput {
    return sortBy((response as Array<unknown>).map(transformMigration), { key: 'requestDate', order: 'desc' });
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
