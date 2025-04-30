/**
 * @import { CreateAddonProviderFeatureCommandInput, CreateAddonProviderFeatureCommandOutput } from './create-addon-provider-feature-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFeature } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateAddonProviderFeatureCommandInput, CreateAddonProviderFeatureCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders/:XXX/features
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderFeatureCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateAddonProviderFeatureCommandInput, CreateAddonProviderFeatureCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features`, {
      name: params.name,
      type: params.type,
    });
  }

  /** @type {CcApiSimpleCommand<CreateAddonProviderFeatureCommandInput, CreateAddonProviderFeatureCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProviderFeature(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
