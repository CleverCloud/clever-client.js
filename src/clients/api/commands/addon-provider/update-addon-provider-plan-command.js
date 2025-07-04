/**
 * @import { UpdateAddonProviderPlanCommandInput, UpdateAddonProviderPlanCommandOutput } from './update-addon-provider-plan-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderPlan } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateAddonProviderPlanCommandInput, UpdateAddonProviderPlanCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX
 * @group AddonProvider
 * @version 2
 */
export class UpdateAddonProviderPlanCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateAddonProviderPlanCommandInput, UpdateAddonProviderPlanCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
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

  /** @type {CcApiSimpleCommand<UpdateAddonProviderPlanCommandInput, UpdateAddonProviderPlanCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProviderPlan(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
