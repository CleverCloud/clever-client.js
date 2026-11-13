import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetMigrationCommandInput, GetMigrationCommandOutput } from './get-migration-command.types.ts';
import { transformMigration } from './migration-transform.ts';

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
