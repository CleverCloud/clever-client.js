import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddon } from './addon-transform.ts';
import type { GetAddonCommandInput, GetAddonCommandOutput } from './get-addon-command.types.ts';

/**
 * Retrieves an add-on, with the provider and plan it was provisioned from.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class GetAddonCommand extends CcApiSimpleCommand<GetAddonCommandInput, GetAddonCommandOutput> {
  toRequestParams(params: GetAddonCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetAddonCommandOutput {
    return transformAddon(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
