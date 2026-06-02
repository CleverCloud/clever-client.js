import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetZoneCommandInput, GetZoneCommandOutput } from './get-zone-command.types.js';
import { transformZone } from './zone-transform.js';

/**
 * @endpoint [GET] /v4/products/zones/:XXX
 * @group Zone
 * @version 4
 */
export class GetZoneCommand extends CcApiSimpleCommand<GetZoneCommandInput, GetZoneCommandOutput> {
  toRequestParams(params: GetZoneCommandInput) {
    let queryParms: QueryParams;
    if (params.ownerId != null) {
      queryParms = new QueryParams().append('ownerId', params.ownerId);
    }

    return get(`/v4/products/zones/${params.zoneName}`, queryParms);
  }

  transformCommandOutput(response: unknown): GetZoneCommandOutput {
    return transformZone(response);
  }
}
