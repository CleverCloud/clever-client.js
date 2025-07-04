import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { MetricKind, Metrics } from './metrics.types.js';

export type GetMetricsCommandInput = ApplicationOrAddonId & {
  metrics?: Array<MetricKind>;
  interval?: string;
  span?: string;
  end?: Date | string | number;
  fill?: boolean;
};

export type GetMetricsCommandOutput = Metrics;
