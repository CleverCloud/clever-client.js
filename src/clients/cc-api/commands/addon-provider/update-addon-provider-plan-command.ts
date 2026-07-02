import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProviderPlan } from './addon-provider-transform.js';
import type {
  UpdateAddonProviderPlanCommandInput,
  UpdateAddonProviderPlanCommandOutput,
} from './update-addon-provider-plan-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX
 * @group AddonProvider
 * @version 2
 */
export class UpdateAddonProviderPlanCommand extends CcApiSimpleCommand<
  UpdateAddonProviderPlanCommandInput,
  UpdateAddonProviderPlanCommandOutput
> {
  toRequestParams(params: UpdateAddonProviderPlanCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/plans/${params.planId}`,
      {
        name: params.name,
        slug: params.slug,
        price: params.price,
        features: params.features ?? [],
      },
    );
  }

  transformCommandOutput(response: unknown): UpdateAddonProviderPlanCommandOutput {
    return transformAddonProviderPlan(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
