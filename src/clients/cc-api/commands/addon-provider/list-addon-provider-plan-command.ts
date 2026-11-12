import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonProviderPlan } from './addon-provider-transform.ts';
import type {
  ListAddonProviderPlanCommandInput,
  ListAddonProviderPlanCommandOutput,
} from './list-addon-provider-plan-command.types.ts';

/**
 * Lists the pricing plans offered by an add-on provider.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX/plans
 * @group AddonProvider
 * @version 2
 */
export class ListAddonProviderPlanCommand extends CcApiSimpleCommand<
  ListAddonProviderPlanCommandInput,
  ListAddonProviderPlanCommandOutput
> {
  toRequestParams(params: ListAddonProviderPlanCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/plans`);
  }

  transformCommandOutput(response: unknown): ListAddonProviderPlanCommandOutput {
    return sortBy((response as Array<unknown>).map(transformAddonProviderPlan), 'price', 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
