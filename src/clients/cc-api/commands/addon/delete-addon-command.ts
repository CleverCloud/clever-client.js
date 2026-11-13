import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteAddonCommandInput } from './delete-addon-command.types.ts';

/**
 * Deprovisions an add-on.
 *
 * The underlying resource and the data it holds are destroyed by the provider.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class DeleteAddonCommand extends CcApiSimpleCommand<DeleteAddonCommandInput, undefined> {
  toRequestParams(params: DeleteAddonCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`);
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

  // a deprovisioned add-on is skipped by the owner lookup, so a replay answers 404 without
  // deprovisioning anything again
  isIdempotent(): boolean {
    return true;
  }
}
