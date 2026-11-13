import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteAddonProviderCommandInput } from './delete-addon-provider-command.types.ts';

/**
 * Removes an add-on provider from the marketplace.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/addonproviders/:XXX
 * @group AddonProvider
 * @version 2
 */
export class DeleteAddonProviderCommand extends CcApiSimpleCommand<DeleteAddonProviderCommandInput, undefined> {
  toRequestParams(params: DeleteAddonProviderCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}`);
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
