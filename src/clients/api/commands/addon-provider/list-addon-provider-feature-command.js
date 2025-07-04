/**
 * @import { ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput } from './list-addon-provider-feature-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFeature } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX/features
 * @group AddonProvider
 * @version 2
 */
export class ListAddonProviderFeatureCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features`);
  }

  /** @type {CcApiSimpleCommand<ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformAddonProviderFeature);
  }

  /** @type {CcApiSimpleCommand<ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
