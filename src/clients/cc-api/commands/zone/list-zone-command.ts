/**
 * @import { ListZoneCommandInput, ListZoneCommandOutput } from './list-zone-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformZone } from './zone-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListZoneCommandInput, ListZoneCommandOutput>}
 * @endpoint [GET] /v4/products/zones
 * @group Zone
 * @version 4
 */
export class ListZoneCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListZoneCommandInput, ListZoneCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {QueryParams} */
    let queryParms;
    if (params != null && typeof params === 'object') {
      queryParms = new QueryParams().append('ownerId', params.ownerId);
    }

    return get(`/v4/products/zones`, queryParms);
  }

  /** @type {CcApiSimpleCommand<ListZoneCommandInput, ListZoneCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformZone), 'name');
  }
}
