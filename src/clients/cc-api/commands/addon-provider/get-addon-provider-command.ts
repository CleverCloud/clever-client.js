import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonProvider } from './addon-provider-transform.ts';
import type {
  GetAddonProviderCommandInput,
  GetAddonProviderCommandOutput,
} from './get-addon-provider-command.types.ts';

/**
 * Retrieves an add-on provider owned by an organisation.
 *
 * Only the provider description is returned: its plans and features are listed separately.
 *
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
