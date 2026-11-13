import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { ListMigrationCommandInput, ListMigrationCommandOutput } from './list-migration-command.types.ts';
import { transformMigration } from './migration-transform.ts';

/**
 * Lists the migrations an add-on went through, past and running.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class ListMigrationCommand extends CcApiSimpleCommand<ListMigrationCommandInput, ListMigrationCommandOutput> {
  toRequestParams(params: ListMigrationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations`);
  }

  transformCommandOutput(response: unknown): ListMigrationCommandOutput {
    return sortBy((response as Array<unknown>).map(transformMigration), { key: 'requestedAt', order: 'desc' });
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
