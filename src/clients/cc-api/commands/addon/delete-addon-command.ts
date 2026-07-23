import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteAddonCommandInput } from './delete-addon-command.types.js';

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
}
