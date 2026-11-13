import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonProvider } from './addon-provider-transform.ts';
import type {
  UpdateAddonProviderCommandInput,
  UpdateAddonProviderCommandOutput,
} from './update-addon-provider-command.types.ts';

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
