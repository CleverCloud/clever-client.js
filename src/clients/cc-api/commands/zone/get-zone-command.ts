import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetZoneCommandInput, GetZoneCommandOutput } from './get-zone-command.types.js';
import { transformZone } from './zone-transform.js';

/**
 * Retrieves one zone by name.
 *
 * @endpoint [GET] /v4/products/zones/:XXX
 * @group Zone
 * @version 4
 */
export class GetZoneCommand extends CcApiSimpleCommand<GetZoneCommandInput, GetZoneCommandOutput> {
  toRequestParams(params: GetZoneCommandInput) {
    const queryParms = new QueryParams().append('ownerId', params.ownerId).append('tag', params.tag);

    return get(`/v4/products/zones/${params.zoneName}`, queryParms);
  }

  transformCommandOutput(response: unknown): GetZoneCommandOutput {
    return transformZone(response);
  }
}
