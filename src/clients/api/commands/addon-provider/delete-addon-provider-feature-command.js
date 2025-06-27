/**
 * @import { DeleteAddonProviderFeatureCommandInput, DeleteAddonProviderFeatureCommandOutput } from './delete-addon-provider-feature-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteAddonProviderFeatureCommandInput, DeleteAddonProviderFeatureCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX/features/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderFeatureCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteAddonProviderFeatureCommandInput, DeleteAddonProviderFeatureCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX/addonproviders/:XXX/features/:XXX`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
