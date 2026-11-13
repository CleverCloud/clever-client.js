import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetZoneCommandInput, GetZoneCommandOutput } from './get-zone-command.types.ts';
import { transformZone } from './zone-transform.ts';

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

    return get(safeUrl`/v4/products/zones/${params.zoneName}`, queryParms);
  }

  transformCommandOutput(response: unknown): GetZoneCommandOutput {
    return transformZone(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
