/**
 * @import { GetLoadBalancerInfoCommandInput, GetLoadBalancerInfoCommandOutput } from './get-load-balancer-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLoadBalancer } from './load-balancer-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetLoadBalancerInfoCommandInput, GetLoadBalancerInfoCommandOutput>}
 * @endpoint [GET] /v4/load-balancers/organisations/:XXX/applications/:XXX/load-balancers/:XXX
 * @endpoint [GET] /v4/load-balancers/organisations/:XXX/addons/:XXX/load-balancers/:XXX
 * @group LoadBalancer
 * @version 4
 */
export class GetLoadBalancerInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetLoadBalancerInfoCommandInput, GetLoadBalancerInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    if ('applicationId' in params) {
      return get(
        safeUrl`/v4/load-balancers/organisations/${params.ownerId}/applications/${params.applicationId}/load-balancers/${params.kind ?? 'default'}`,
      );
    }

    return get(
      safeUrl`/v4/load-balancers/organisations/${params.ownerId}/addons/${params.addonId}/load-balancers/${params.kind ?? 'default'}`,
    );
  }

  /** @type {CcApiSimpleCommand<GetLoadBalancerInfoCommandInput, GetLoadBalancerInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformLoadBalancer);
  }

  /** @type {CcApiSimpleCommand<GetLoadBalancerInfoCommandInput, GetLoadBalancerInfoCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
