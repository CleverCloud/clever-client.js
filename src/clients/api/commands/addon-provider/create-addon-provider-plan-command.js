/**
 * @import { CreateAddonProviderPlanCommandInput, CreateAddonProviderPlanCommandOutput } from './create-addon-provider-plan-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderPlan } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateAddonProviderPlanCommandInput, CreateAddonProviderPlanCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders/:XXX/plans
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderPlanCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateAddonProviderPlanCommandInput, CreateAddonProviderPlanCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/plans`,
      omit(params, 'ownerId', 'addonProviderId'),
    );
  }

  /** @type {CcApiSimpleCommand<CreateAddonProviderPlanCommandInput, CreateAddonProviderPlanCommandOutput>['transformCommandOutput']} */
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
