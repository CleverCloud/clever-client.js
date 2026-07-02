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
 * @endpoint [PUT] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class UpdateAddonProviderCommand extends CcApiSimpleCommand<
  UpdateAddonProviderCommandInput,
  UpdateAddonProviderCommandOutput
> {
  toRequestParams(params: UpdateAddonProviderCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`,
      omit(params, 'ownerId', 'addonProviderId'),
    );
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
