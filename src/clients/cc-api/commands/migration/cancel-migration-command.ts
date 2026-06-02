import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CancelMigrationCommandInput } from './cancel-migration-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class CancelMigrationCommand extends CcApiSimpleCommand<CancelMigrationCommandInput, void> {
  toRequestParams(params: CancelMigrationCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}addons/${params.addonId}/migrations/:XXX`);
  }

  transformCommandOutput(): void {
    return null;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
