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
 * Updates a pricing plan of an add-on provider.
 *
 * The name, the slug and the price are overwritten. Features are matched by name and set one at a
 * time: those left out of the input keep their current value, and a name the provider does not
 * declare as a feature is ignored.
 *
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

  // the plan fields are overwritten and each given feature is matched by name, so a replay lands on
  // the same plan
  isIdempotent(): boolean {
    return true;
  }
}
