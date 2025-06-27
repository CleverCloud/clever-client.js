/**
 * @import { ListAddonProviderPlanCommandInput, ListAddonProviderPlanCommandOutput } from './list-addon-provider-plan-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListAddonProviderPlanCommandInput, ListAddonProviderPlanCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX/plans
 * @group AddonProvider
 * @version 2
 */
export class ListAddonProviderPlanCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListAddonProviderPlanCommandInput, ListAddonProviderPlanCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/:XXX/addonproviders/:XXX/plans`);
  }

  /** @type {CcApiSimpleCommand<ListAddonProviderPlanCommandInput, ListAddonProviderPlanCommandOutput>['isEmptyResponse']} */
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
