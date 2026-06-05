import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ListZoneCommandInput, ListZoneCommandOutput } from './list-zone-command.types.js';
import { transformZone } from './zone-transform.js';

/**
 * @endpoint [GET] /v4/products/zones
 * @group Zone
 * @version 4
 */
export class ListZoneCommand extends CcApiSimpleCommand<ListZoneCommandInput, ListZoneCommandOutput> {
  toRequestParams(params: ListZoneCommandInput) {
    let queryParms: QueryParams | undefined;
    if (params != null && typeof params === 'object') {
      queryParms = new QueryParams().append('ownerId', params.ownerId);
    }

    return get(`/v4/products/zones`, queryParms);
  }

  transformCommandOutput(response: unknown): ListZoneCommandOutput {
    return sortBy((response as Array<unknown>).map(transformZone), 'name');
  }
}
