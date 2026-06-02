import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteAddonProviderCommandInput } from './delete-addon-provider-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderCommand extends CcApiSimpleCommand<DeleteAddonProviderCommandInput, void> {
  toRequestParams(params: DeleteAddonProviderCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
