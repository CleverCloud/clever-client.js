import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonProvider } from './addon-provider-transform.js';
import type {
  UpdateAddonProviderCommandInput,
  UpdateAddonProviderCommandOutput,
} from './update-addon-provider-command.types.js';

/**
 * Updates the public description of an add-on provider.
 *
 * Only the marketplace facing fields can be changed here. The provisioning API settings, the plans
 * and the features have their own endpoints.
 *
 * @endpoint [PUT] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class UpdateAddonProviderCommand extends CcApiSimpleCommand<
  UpdateAddonProviderCommandInput,
  UpdateAddonProviderCommandOutput
> {
  toRequestParams(params: UpdateAddonProviderCommandInput) {
    const body: Record<string, unknown> = {
      ...omit(params, 'ownerId', 'addonProviderId', 'shortDescription', 'longDescription'),
    };
    if (params.shortDescription != null) {
      body.shortDesc = params.shortDescription;
    }
    if (params.longDescription != null) {
      body.longDesc = params.longDescription;
    }

    return put(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`, body);
  }

  transformCommandOutput(response: unknown): UpdateAddonProviderCommandOutput {
    return transformAddonProvider(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
