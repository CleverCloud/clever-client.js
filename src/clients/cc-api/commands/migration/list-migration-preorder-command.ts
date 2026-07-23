import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListMigrationPreorderCommandInput,
  ListMigrationPreorderCommandOutput,
} from './list-migration-preorder-command.types.js';
import { transformMigrationPreorder } from './migration-transform.js';

/**
 * Simulates the invoice of a plan change, so that the price difference can be shown before the migration is started.
 *
 * Nothing is ordered nor charged: the returned document is a purchase order preview.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations/preorders
 * @group Migration
 * @version 2
 */
export class ListMigrationPreorderCommand extends CcApiSimpleCommand<
  ListMigrationPreorderCommandInput,
  ListMigrationPreorderCommandOutput
> {
  toRequestParams(params: ListMigrationPreorderCommandInput) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations/preorders`,
      new QueryParams().set('planId', params.planId),
    );
  }

  transformCommandOutput(response: unknown): ListMigrationPreorderCommandOutput {
    return transformMigrationPreorder(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
