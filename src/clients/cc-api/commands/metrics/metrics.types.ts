/**
 * Time series of resource usage for one application or add-on, one series per requested metric. A metric is absent when
 * it was not asked for, or when the backend has no data point for it over the range.
 * @converted from an array of named series to a record keyed by metric name
 */
export type Metrics = {
  [p in MetricKind]?: Array<MetricData>;
};

/**
 * Which resource usage a series measures: `cpu` and `mem` are percentages of the instance's CPU and RAM,
 * `load1` is the one-minute load average per CPU.
 */
export type MetricKind = 'cpu' | 'mem' | 'load1';

/**
 * One point of a metric series: the value the metric had over one sampling bucket.
 */
export interface MetricData {
  /**
   * When the bucket ends, as a Unix timestamp.
   * @converted from the microseconds the backend reports to milliseconds, unless the command asks for microseconds
   */
  timestamp: number;
  /**
   * Value of the metric over the bucket.
   * @converted to a number
   */
  value: number;
}
