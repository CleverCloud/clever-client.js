import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddon } from './addon-transform.js';
import type { UpdateAddonCommandInput, UpdateAddonCommandOutput } from './update-addon-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class UpdateAddonCommand extends CcApiSimpleCommand<UpdateAddonCommandInput, UpdateAddonCommandOutput> {
  toRequestParams(params: UpdateAddonCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`, { name: params.name });
  }

  transformCommandOutput(response: unknown): UpdateAddonCommandOutput {
    return transformAddon(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
