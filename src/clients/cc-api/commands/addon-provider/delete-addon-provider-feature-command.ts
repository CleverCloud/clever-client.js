import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteAddonProviderFeatureCommandInput } from './delete-addon-provider-feature-command.types.js';

/**
 * Removes a feature from an add-on provider's catalogue.
 *
 * The feature is addressed by name, which the command base64-encodes so it survives the URL path.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX/features/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderFeatureCommand extends CcApiSimpleCommand<
  DeleteAddonProviderFeatureCommandInput,
  undefined
> {
  toRequestParams(params: DeleteAddonProviderFeatureCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features/${encodeToBase64(params.name)}`,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
