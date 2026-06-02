import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteOtoroshiNetworkGroupCommandInput } from './delete-otoroshi-network-group-command.types.js';

/**
 * @endpoint [DELETE] /v4/addon-providers/addon-otoroshi/addons/:XXX/networkgroup
 * @group Otoroshi
 * @version 4
 */
export class DeleteOtoroshiNetworkGroupCommand extends CcApiSimpleCommand<
  DeleteOtoroshiNetworkGroupCommandInput,
  void
> {
  toRequestParams(params: DeleteOtoroshiNetworkGroupCommandInput) {
    return delete_(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/networkgroup`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
