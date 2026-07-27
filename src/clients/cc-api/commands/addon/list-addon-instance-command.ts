import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonInstance } from './addon-transform.js';
import type {
  ListAddonInstanceCommandInput,
  ListAddonInstanceCommandOutput,
} from './list-addon-instance-command.types.js';

/**
 * Lists the virtual machines currently backing an add-on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/instances
 * @group Addon
 * @version 2
 */
export class ListAddonInstanceCommand extends CcApiSimpleCommand<
  ListAddonInstanceCommandInput,
  ListAddonInstanceCommandOutput
> {
  toRequestParams(params: ListAddonInstanceCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/instances`);
  }

  transformCommandOutput(response: unknown): ListAddonInstanceCommandOutput {
    return (response as Array<unknown>).map(transformAddonInstance);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
