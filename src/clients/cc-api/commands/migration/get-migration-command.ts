import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMigrationCommandInput, GetMigrationCommandOutput } from './get-migration-command.types.js';
import { transformMigration } from './migration-transform.js';

/**
 * Retrieves an add-on migration, with the step by step progress of the plan or zone change it performs.
 *
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
