import { normalizeDate } from '../../../../lib/utils.js';
import type { GetHeatMapCommandOutput } from './get-heat-map-command.types.js';
import type { GetMetricsCommandOutput } from './get-metrics-command.types.js';
import type { GetStatusCodeDistributionCommandOutput } from './get-status-code-distribution-command.types.js';
import type { MetricData, MetricKind } from './metrics.types.js';
import type { RequestLocation } from './stream-requests-command.types.js';

const MICROSECONDS_PER_MILLISECOND = 1000;

/** Lowest valid HTTP status code. Codes below this are non-standard. */
const MIN_STANDARD_STATUS_CODE = 100;

export function transformHeatMap(payload: any): GetHeatMapCommandOutput {
  return (payload ?? []).map(({ long, lat, accessCount }: any) => ({
    lat,
    lon: long,
    count: accessCount,
  }));
}

export function transformRequestLocations(data: any): Array<RequestLocation> {
  const payload = JSON.parse(data);
  return payload.map(({ long, lat, city, accessCount }: any) => ({ lat, lon: long, city, count: accessCount }));
}

export function transformMetrics(payload: any, toMilliseconds: boolean): GetMetricsCommandOutput {
  const result: GetMetricsCommandOutput = {};

  payload.forEach(({ name, data }: { name: MetricKind; data: Array<MetricData> }) => {
    result[name] = data.map(({ timestamp, value }: any) => ({
      timestamp: toMilliseconds ? Math.round(timestamp / MICROSECONDS_PER_MILLISECOND) : timestamp,
      value: Number(value),
    }));
  });

  return result;
}

export function transformStatusCodeDistribution(
  payload: any,
  excludeNonStandard: boolean,
): GetStatusCodeDistributionCommandOutput {
  const keep = (statuses: any) =>
    (statuses ?? []).filter(({ code }: any) => !excludeNonStandard || code >= MIN_STANDARD_STATUS_CODE);

  const byDate = payload.map(({ date, statuses }: any) => {
    const kept = keep(statuses);
    return {
      date: normalizeDate(date),
      total: kept.reduce((sum: number, { count }: any) => sum + count, 0),
      statuses: Object.fromEntries(kept.map(({ code, count }: any) => [code, count])),
    };
  });

  const statuses: Record<number, number> = {};
  payload.forEach(({ statuses: entryStatuses }: any) => {
    keep(entryStatuses).forEach(({ code, count }: any) => {
      statuses[code] = (statuses[code] ?? 0) + count;
    });
  });

  return {
    byDate,
    byStatusCode: {
      total: Object.values(statuses).reduce((sum, count) => sum + count, 0),
      statuses,
    },
  };
}
