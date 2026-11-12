import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetLoadBalancerInfoCommandInput,
  GetLoadBalancerInfoCommandOutput,
} from './get-load-balancer-info-command.types.ts';
import { transformLoadBalancer } from './load-balancer-transform.ts';

/**
 * Lists the load balancers serving an application or an add-on, with the DNS records to point a domain at them.
 *
 * The endpoint called depends on whether an application id or an add-on id is given. When no kind is provided, the
 * public `default` load balancers are returned.
 *
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
