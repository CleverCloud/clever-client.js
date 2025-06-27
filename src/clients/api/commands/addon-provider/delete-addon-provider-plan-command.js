/**
 * @import { DeleteAddonProviderPlanCommandInput, DeleteAddonProviderPlanCommandOutput } from './delete-addon-provider-plan-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteAddonProviderPlanCommandInput, DeleteAddonProviderPlanCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderPlanCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteAddonProviderPlanCommandInput, DeleteAddonProviderPlanCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX/addonproviders/:XXX/plans/:XXX`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
