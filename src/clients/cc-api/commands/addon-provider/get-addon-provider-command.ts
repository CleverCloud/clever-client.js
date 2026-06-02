import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProvider } from './addon-provider-transform.js';
import type {
  GetAddonProviderCommandInput,
  GetAddonProviderCommandOutput,
} from './get-addon-provider-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class GetAddonProviderCommand extends CcApiSimpleCommand<
  GetAddonProviderCommandInput,
  GetAddonProviderCommandOutput
> {
  toRequestParams(params: GetAddonProviderCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`);
  }

  transformCommandOutput(response: unknown): GetAddonProviderCommandOutput {
    return transformAddonProvider(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
