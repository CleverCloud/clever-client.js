import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteAddonProviderPlanCommandInput } from './delete-addon-provider-plan-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderPlanCommand extends CcApiSimpleCommand<DeleteAddonProviderPlanCommandInput, void> {
  toRequestParams(params: DeleteAddonProviderPlanCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/plans/${params.planId}`,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
