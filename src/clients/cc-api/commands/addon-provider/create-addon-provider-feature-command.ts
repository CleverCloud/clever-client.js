import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProviderFeature } from './addon-provider-transform.js';
import type {
  CreateAddonProviderFeatureCommandInput,
  CreateAddonProviderFeatureCommandOutput,
} from './create-addon-provider-feature-command.types.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders/:XXX/features
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderFeatureCommand extends CcApiSimpleCommand<
  CreateAddonProviderFeatureCommandInput,
  CreateAddonProviderFeatureCommandOutput
> {
  toRequestParams(params: CreateAddonProviderFeatureCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features`, {
      name: params.name,
      type: params.type,
    });
  }

  transformCommandOutput(response: unknown): CreateAddonProviderFeatureCommandOutput {
    return transformAddonProviderFeature(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
