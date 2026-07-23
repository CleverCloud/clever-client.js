import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

/**
 * Identifies whose requests the distribution covers, and over which time range. The owner is resolved
 * automatically when omitted.
 */
export type GetStatusCodeDistributionCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the distribution to a single application.
   * When omitted, the distribution covers every application of the owner.
   */
  applicationId?: string;
  /** Start of the time range. Defaults to 24 hours before the end of the range. */
  from?: Date | string | number;
  /** End of the time range. Defaults to the start of the current hour. */
  to?: Date | string | number;
  /**
   * Drop non-standard status codes (lower than 100) from the result.
   * Totals are recomputed over the remaining status codes.
   * @default false
   */
  excludeNonStandardStatusCodes?: boolean;
}>;

/**
 * How the HTTP responses served over the range break down by status code, both hour by hour and over the whole
 * range.
 */
export interface GetStatusCodeDistributionCommandOutput {
  /** Distribution per time bucket, one bucket per hour of the range. */
  byDate: Array<StatusCodeDistributionByDate>;
  /** Distribution aggregated over the whole period, keyed by HTTP status code. */
  byStatusCode: StatusCodeCounts;
}

/**
 * Request counts broken down by HTTP status code, with their total.
 */
export interface StatusCodeCounts {
  /**
   * Total number of requests across all status codes. Summed over the kept status codes, the payload does not
   * carry it.
   */
  total: number;
  /**
   * Request count keyed by HTTP status code.
   * @converted from an array of `{ code, count }` to a record keyed by code
   */
  statuses: Record<number, number>;
}

/**
 * The request counts of one hourly bucket of the range.
 */
export interface StatusCodeDistributionByDate extends StatusCodeCounts {
  /**
   * Date of the time bucket.
   * @converted to an ISO date string
   */
  date: string;
}
