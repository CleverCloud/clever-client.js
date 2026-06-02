/** @import { GetZoneCommandInput, GetZoneCommandOutput } from "./get-zone-command.types.js" */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformZone } from './zone-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetZoneCommandInput, GetZoneCommandOutput>}
 * @endpoint [GET] /v4/products/zones/:XXX
 * @group Zone
 * @version 4
 */
export class GetZoneCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetZoneCommandInput, GetZoneCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {QueryParams} */
    let queryParms;
    if (params.ownerId != null) {
      queryParms = new QueryParams().append('ownerId', params.ownerId);
    }

    return get(`/v4/products/zones/${params.zoneName}`, queryParms);
  }

  /** @type {CcApiSimpleCommand<GetZoneCommandInput, GetZoneCommandOutput>['transformCommandOutput']} response */
  transformCommandOutput(response) {
    return transformZone(response);
  }
}
