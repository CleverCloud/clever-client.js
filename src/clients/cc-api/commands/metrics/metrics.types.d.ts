export type Metrics = {
  [p in MetricKind]?: Array<MetricData>;
};

export type MetricKind = 'cpu' | 'mem' | 'load1';

export interface MetricData {
  timestamp: number;
  value: number;
}
