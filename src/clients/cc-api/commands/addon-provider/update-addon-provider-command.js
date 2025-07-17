/**
 * @import { UpdateAddonProviderCommandInput, UpdateAddonProviderCommandOutput } from './update-addon-provider-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProvider } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateAddonProviderCommandInput, UpdateAddonProviderCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class UpdateAddonProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateAddonProviderCommandInput, UpdateAddonProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`,
      omit(params, 'ownerId', 'addonProviderId'),
    );
  }

  /** @type {CcApiSimpleCommand<UpdateAddonProviderCommandInput, UpdateAddonProviderCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProvider(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
