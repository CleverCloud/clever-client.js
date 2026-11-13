import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformAddon } from './addon-transform.ts';
import type { ListAddonCommandInput, ListAddonCommandOutput } from './list-addon-command.types.ts';

/**
 * Lists every add-on provisioned in an organisation.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons
 * @group Addon
 * @version 2
 */
export class ListAddonCommand extends CcApiSimpleCommand<ListAddonCommandInput, ListAddonCommandOutput> {
  toRequestParams(params: ListAddonCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons`);
  }

  transformCommandOutput(response: unknown): ListAddonCommandOutput {
    return sortBy((response as Array<unknown>).map(transformAddon), 'name');
  }

  isIdempotent(): boolean {
    return true;
  }
}
