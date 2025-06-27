import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type GetMetricsCommandInput = ApplicationOrAddonId & {
  metrics?: Array<MetricKind>;
  interval?: string;
  span?: string;
  end?: Date | string | number;
  fill?: boolean;
};

export type GetMetricsCommandOutput = {
  [p in MetricKind]?: Array<MetricData>;
};

export type MetricKind = 'cpu' | 'mem' | 'load1';

export interface MetricData {
  timestamp: number;
  value: number;
}
