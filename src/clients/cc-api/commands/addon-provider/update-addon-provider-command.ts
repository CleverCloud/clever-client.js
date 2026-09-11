import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
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
    return put(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`, {
      name: params.name,
      website: params.website,
      supportEmail: params.supportEmail,
      googlePlusName: params.googlePlusName,
      twitterName: params.twitterName,
      analyticsId: params.analyticsId,
      shortDesc: params.shortDescription,
      longDesc: params.longDescription,
      logoUrl: params.logoUrl,
    });
  }

  transformCommandOutput(response: unknown): UpdateAddonProviderCommandOutput {
    return transformAddonProvider(response);
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
