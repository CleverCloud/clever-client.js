import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMetricsCommandInput, GetMetricsCommandOutput } from './get-metrics-command.types.js';
import { transformMetrics } from './metrics-transform.js';

/**
 * Gets the resource usage time series of an application or an add-on over a time window.
 *
 * The series come from Warp10, where the raw telegraf measurements of every instance are aggregated into one
 * series per metric: CPU takes the busiest instance, memory and load are averaged. The window ends at `end`
 * and spans `interval` backwards, sampled into buckets of `span`; `fill` decides whether the buckets with no
 * measurement come back as 0 or are left out.
 *
 * @endpoint [GET] /v4/stats/organisations/:XXX/resources/:XXX/metrics
 * @group Metrics
 * @version 4
 */
export class GetMetricsCommand extends CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput> {
  toRequestParams(params: GetMetricsCommandInput) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/resources/${resourceId}/metrics`,
      new QueryParams()
        .set('only', (params.metrics?.length ?? 0) > 0 ? Array.from(new Set(params.metrics).values()) : null)
        .set('interval', params.interval)
        .set('span', params.span)
        .set('end', normalizeDate(params.end))
        .set('fill', params.fill),
    );
  }

  transformCommandOutput(response: unknown): GetMetricsCommandOutput {
    const toMilliseconds = this.params.timestampUnit == null || this.params.timestampUnit === 'ms';
    return transformMetrics(response, toMilliseconds);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
