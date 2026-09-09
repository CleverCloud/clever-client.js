import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { MetricKind, Metrics } from './metrics.types.js';

/**
 * Identifies the application or add-on the metrics are read from, and describes the window to read them over.
 * The owner is resolved automatically when omitted.
 */
export type GetMetricsCommandInput = ApplicationOrAddonId & {
  /**
   * Metrics to return. All of them are returned when omitted or empty.
   * @sentAs `only`
   * @converted deduplicated
   */
  metrics?: Array<MetricKind>;
  /**
   * Length of the window to read, as an ISO 8601 duration (`PT30M`, `PT6H`, ...) or a number of milliseconds.
   * Defaults to 30 minutes.
   * @converted to an ISO 8601 duration
   */
  interval?: number | string;
  /**
   * Size of the sampling buckets the window is cut into, as an ISO 8601 duration or a number of milliseconds.
   * Defaults to 2 minutes. The backend rejects a span more than 300 times smaller than the interval.
   * @converted to an ISO 8601 duration
   */
  span?: number | string;
  /**
   * Moment the window ends at. Defaults to now.
   * @converted to an ISO date string
   */
  end?: Date | string | number;
  /** Whether buckets with no measurement come back with a value of 0 rather than being left out. */
  fill?: boolean;
  /**
   * Unit of the `timestamp` field in the result.
   * @default 'ms'
   */
  timestampUnit?: 'us' | 'ms';
};

/**
 * The requested time series, one per metric that had data over the window.
 */
export type GetMetricsCommandOutput = Metrics;
