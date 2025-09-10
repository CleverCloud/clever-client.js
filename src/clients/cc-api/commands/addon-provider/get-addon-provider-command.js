/**
 * @import { GetAddonProviderCommandInput, GetAddonProviderCommandOutput } from './get-addon-provider-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProvider } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetAddonProviderCommandInput, GetAddonProviderCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class GetAddonProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetAddonProviderCommandInput, GetAddonProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`);
  }

  /** @type {CcApiSimpleCommand<GetAddonProviderCommandInput, GetAddonProviderCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProvider(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
