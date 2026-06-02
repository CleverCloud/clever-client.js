import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProviderPlan } from './addon-provider-transform.js';
import type {
  CreateAddonProviderPlanCommandInput,
  CreateAddonProviderPlanCommandOutput,
} from './create-addon-provider-plan-command.types.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders/:XXX/plans
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderPlanCommand extends CcApiSimpleCommand<
  CreateAddonProviderPlanCommandInput,
  CreateAddonProviderPlanCommandOutput
> {
  toRequestParams(params: CreateAddonProviderPlanCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/plans`, {
      name: params.name,
      slug: params.slug,
      price: params.price,
      features: params.features ?? [],
    });
  }

  transformCommandOutput(response: unknown): CreateAddonProviderPlanCommandOutput {
    return transformAddonProviderPlan(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
