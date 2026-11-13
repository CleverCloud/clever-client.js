import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteAddonProviderPlanCommandInput } from './delete-addon-provider-plan-command.types.ts';

/**
 * Removes a pricing plan from an add-on provider's catalogue.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderPlanCommand extends CcApiSimpleCommand<DeleteAddonProviderPlanCommandInput, undefined> {
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

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
