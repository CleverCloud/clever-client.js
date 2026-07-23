import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformMigration } from './migration-transform.js';
import type { StartMigrationCommandInput, StartMigrationCommandOutput } from './start-migration-command.types.js';

/**
 * Starts the migration of an add-on to another plan, zone or version.
 *
 * The migration runs asynchronously on the add-on provider side; the returned migration describes the steps it will
 * go through and their initial status.
 *
 * @endpoint [POST] /v2/organisations/:XXX/addons/:XXX/migrations
 * @group Migration
 * @version 2
 */
export class StartMigrationCommand extends CcApiSimpleCommand<StartMigrationCommandInput, StartMigrationCommandOutput> {
  toRequestParams(params: StartMigrationCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations`, {
      planId: params.planId,
      region: params.zone,
      version: params.version,
    });
  }

  transformCommandOutput(response: unknown): StartMigrationCommandOutput {
    return transformMigration(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
