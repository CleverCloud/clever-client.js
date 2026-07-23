export type Metrics = {
  [p in MetricKind]?: Array<MetricData>;
};

export type MetricKind = 'cpu' | 'mem' | 'load1';

export interface MetricData {
  // transformed: converted from microseconds to milliseconds, unless the command asks for microseconds
  timestamp: number;
  // transformed: converted to a number
  value: number;
}
