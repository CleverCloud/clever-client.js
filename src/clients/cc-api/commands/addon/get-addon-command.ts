import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddon } from './addon-transform.js';
import type { GetAddonCommandInput, GetAddonCommandOutput } from './get-addon-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class GetAddonCommand extends CcApiSimpleCommand<GetAddonCommandInput, GetAddonCommandOutput> {
  toRequestParams(params: GetAddonCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
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
}
