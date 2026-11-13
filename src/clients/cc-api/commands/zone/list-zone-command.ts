import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { ListZoneCommandInput, ListZoneCommandOutput } from './list-zone-command.types.ts';
import { transformZone } from './zone-transform.ts';

/**
 * Lists the zones applications and add-ons can be deployed in.
 *
 * Passing an owner narrows the list down to the zones that organisation has access to; calling it
 * without any parameter lists the public zones.
 *
 * @endpoint [GET] /v4/products/zones
 * @group Zone
 * @version 4
 */
export class ListZoneCommand extends CcApiSimpleCommand<ListZoneCommandInput, ListZoneCommandOutput> {
  toRequestParams(params: ListZoneCommandInput) {
    let queryParms: QueryParams | undefined;
    if (params != null && typeof params === 'object') {
      queryParms = new QueryParams().append('ownerId', params.ownerId).append('tag', params.tag);
    }

    return get(`/v4/products/zones`, queryParms);
  }

  transformCommandOutput(response: unknown): ListZoneCommandOutput {
    return sortBy((response as Array<unknown>).map(transformZone), 'name');
  }

  isIdempotent(): boolean {
    return true;
  }
}
