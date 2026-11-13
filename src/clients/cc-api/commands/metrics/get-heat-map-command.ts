import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { normalizeDate, safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetHeatMapCommandInput, GetHeatMapCommandOutput } from './get-heat-map-command.types.ts';
import { transformHeatMap } from './metrics-transform.ts';

/**
 * Gets the geographic heat map of incoming requests for an owner, optionally restricted to a single application.
 * Each point aggregates the number of requests originating from a geographic cell over the time range. Cells
 * are roughly 39 km wide, and the coordinates of a point are the centre of its cell. Requests whose source IP
 * address could not be geolocated are not counted.
 *
 * @endpoint [GET] /v4/stats/organisations/:XXX/requests
 * @group Metrics
 * @version 4
 */
export class GetHeatMapCommand extends CcApiSimpleCommand<GetHeatMapCommandInput, GetHeatMapCommandOutput> {
  toRequestParams(params: GetHeatMapCommandInput) {
    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/requests`,
      new QueryParams()
        .set('applicationId', params.applicationId)
        .set('from', normalizeDate(params.from))
        .set('to', normalizeDate(params.to)),
    );
  }

  transformCommandOutput(response: unknown): GetHeatMapCommandOutput {
    return transformHeatMap(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
