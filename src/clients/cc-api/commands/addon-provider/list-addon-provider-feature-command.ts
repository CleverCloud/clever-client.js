import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProviderFeature } from './addon-provider-transform.js';
import type {
  ListAddonProviderFeatureCommandInput,
  ListAddonProviderFeatureCommandOutput,
} from './list-addon-provider-feature-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX/features
 * @group AddonProvider
 * @version 2
 */
export class ListAddonProviderFeatureCommand extends CcApiSimpleCommand<
  ListAddonProviderFeatureCommandInput,
  ListAddonProviderFeatureCommandOutput
> {
  toRequestParams(params: ListAddonProviderFeatureCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features`);
  }

  transformCommandOutput(response: unknown): ListAddonProviderFeatureCommandOutput {
    return sortBy((response as Array<unknown>).map(transformAddonProviderFeature), 'name');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
