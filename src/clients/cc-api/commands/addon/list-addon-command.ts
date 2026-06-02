import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';
import type { ListAddonCommandInput, ListAddonCommandOutput } from './list-addon-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons
 * @group Addon
 * @version 2
 */
export class ListAddonCommand extends CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput> {
  toRequestParams(params: ListAddonCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons`);
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  transformCommandOutput(response: unknown): ListAddonCommandOutput {
    return sortBy((response as Array<unknown>).map(transformAddon), 'name');
  }
}
