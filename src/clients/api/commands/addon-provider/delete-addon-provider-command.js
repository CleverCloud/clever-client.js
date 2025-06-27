/**
 * @import { DeleteAddonProviderCommandInput, DeleteAddonProviderCommandOutput } from './delete-addon-provider-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteAddonProviderCommandInput, DeleteAddonProviderCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteAddonProviderCommandInput, DeleteAddonProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
