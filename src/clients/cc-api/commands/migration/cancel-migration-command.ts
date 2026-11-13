import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { CancelMigrationCommandInput } from './cancel-migration-command.types.ts';

/**
 * Aborts a running add-on migration.
 *
 * The request is forwarded to the add-on provider, which is the one that actually stops the migration.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class CancelMigrationCommand extends CcApiSimpleCommand<CancelMigrationCommandInput, undefined> {
  toRequestParams(params: CancelMigrationCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations/${params.migrationId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }

  // the provider is asked to abort a migration named by its id, so a replay aborts nothing more
  isIdempotent(): boolean {
    return true;
  }
}
