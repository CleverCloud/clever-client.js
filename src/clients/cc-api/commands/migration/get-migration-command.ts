import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMigrationCommandInput, GetMigrationCommandOutput } from './get-migration-command.types.js';
import { transformMigration } from './migration-transform.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class GetMigrationCommand extends CcApiSimpleCommand<GetMigrationCommandInput, GetMigrationCommandOutput> {
  toRequestParams(params: GetMigrationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations/${params.migrationId}`);
  }

  transformCommandOutput(response: unknown): GetMigrationCommandOutput {
    return transformMigration(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
