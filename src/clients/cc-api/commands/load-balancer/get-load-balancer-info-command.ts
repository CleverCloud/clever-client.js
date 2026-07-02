import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetLoadBalancerInfoCommandInput,
  GetLoadBalancerInfoCommandOutput,
} from './get-load-balancer-info-command.types.js';
import { transformLoadBalancer } from './load-balancer-transform.js';

/**
 * @endpoint [GET] /v4/load-balancers/organisations/:XXX/applications/:XXX/load-balancers/:XXX
 * @endpoint [GET] /v4/load-balancers/organisations/:XXX/addons/:XXX/load-balancers/:XXX
 * @group LoadBalancer
 * @version 4
 */
export class GetLoadBalancerInfoCommand extends CcApiSimpleCommand<
  GetLoadBalancerInfoCommandInput,
  GetLoadBalancerInfoCommandOutput
> {
  toRequestParams(params: GetLoadBalancerInfoCommandInput) {
    if ('applicationId' in params) {
      return get(
        safeUrl`/v4/load-balancers/organisations/${params.ownerId}/applications/${params.applicationId}/load-balancers/${params.kind ?? 'default'}`,
      );
    }

    return get(
      safeUrl`/v4/load-balancers/organisations/${params.ownerId}/addons/${params.addonId}/load-balancers/${params.kind ?? 'default'}`,
    );
  }

  transformCommandOutput(response: unknown): GetLoadBalancerInfoCommandOutput {
    return sortBy((response as Array<unknown>).map(transformLoadBalancer), 'id');
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
