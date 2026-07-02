import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProviderPlan } from './addon-provider-transform.js';
import type {
  ListAddonProviderPlanCommandInput,
  ListAddonProviderPlanCommandOutput,
} from './list-addon-provider-plan-command.types.js';

/**
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

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
