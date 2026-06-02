import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetHeatMapCommandInput, GetHeatMapCommandOutput } from './get-heat-map-command.types.js';
import { transformHeatMap } from './metrics-transform.js';

/**
 * Gets the geographic heat map of incoming requests for an owner, optionally restricted to a single application.
 * Each point aggregates the number of requests originating from a geographic cell over the time range.
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
}
