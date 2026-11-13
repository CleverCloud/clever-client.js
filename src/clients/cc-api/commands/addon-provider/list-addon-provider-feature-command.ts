import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonProviderFeature } from './addon-provider-transform.ts';
import type {
  ListAddonProviderFeatureCommandInput,
  ListAddonProviderFeatureCommandOutput,
} from './list-addon-provider-feature-command.types.ts';

/**
 * Lists the features declared by an add-on provider.
 *
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
