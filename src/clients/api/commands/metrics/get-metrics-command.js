/**
 * @import { GetMetricsCommandInput, GetMetricsCommandOutput, } from './get-metrics-command.types.js';
 * @import { MetricKind, MetricData } from './metrics.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>}
 * @endpoint [GET] /v4/stats/organisations/:XXX/resources/:XXX/metrics
 * @group Metrics
 * @version 4
 */
export class GetMetricsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/resources/${resourceId}/metrics`,
      new QueryParams()
        .set('only', params.metrics?.length > 0 ? Array.from(new Set(params.metrics).values()) : null)
        .set('interval', params.interval)
        .set('span', params.span)
        .set('end', normalizeDate(params.end))
        .set('fill', params.fill),
    );
  }

  /** @type {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    /** @type {GetMetricsCommandOutput} */
    const result = {};

    response.forEach(
      /** @param {{name: MetricKind, data: Array<MetricData>}} metric */ ({ name, data }) => {
        result[name] = data.map(({ timestamp, value }) => ({ timestamp, value: Number(value) }));
      },
    );

    return result;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
