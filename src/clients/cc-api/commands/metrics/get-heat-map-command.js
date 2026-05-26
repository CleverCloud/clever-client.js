/**
 * @import { GetHeatMapCommandInput, GetHeatMapCommandOutput } from './get-heat-map-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * Gets the geographic heat map of incoming requests for an owner, optionally restricted to a single application.
 * Each point aggregates the number of requests originating from a geographic cell over the time range.
 *
 * @extends {CcApiSimpleCommand<GetHeatMapCommandInput, GetHeatMapCommandOutput>}
 * @endpoint [GET] /v4/stats/organisations/:XXX/requests
 * @group Metrics
 * @version 4
 */
export class GetHeatMapCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetHeatMapCommandInput, GetHeatMapCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/requests`,
      new QueryParams()
        .set('applicationId', params.applicationId)
        .set('from', normalizeDate(params.from))
        .set('to', normalizeDate(params.to)),
    );
  }

  /** @type {CcApiSimpleCommand<GetHeatMapCommandInput, GetHeatMapCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return (response ?? []).map(
      /** @param {{long: number, lat: number, accessCount: number}} point */ ({ long, lat, accessCount }) => ({
        lat,
        lon: long,
        count: accessCount,
      }),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
