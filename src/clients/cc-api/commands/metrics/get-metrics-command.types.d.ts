import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { MetricKind, Metrics } from './metrics.types.js';

export type GetMetricsCommandInput = ApplicationOrAddonId & {
  metrics?: Array<MetricKind>;
  interval?: string;
  span?: string;
  end?: Date | string | number;
  fill?: boolean;
  /**
   * Unit of the `timestamp` field in the result.
   * The API returns microseconds; set to `'ms'` to convert timestamps to milliseconds.
   * @default 'us'
   */
  timestampUnit?: 'us' | 'ms';
};

export type GetMetricsCommandOutput = Metrics;
