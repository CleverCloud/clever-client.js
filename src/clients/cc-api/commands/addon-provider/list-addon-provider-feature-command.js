/**
 * @import { ListAddonProviderFeatureCommandInput, ListAddonProviderFeatureCommandOutput } from './list-addon-provider-feature-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
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
    return sortBy(response.map(transformAddonProviderFeature), 'name');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
