import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

export type GetStatusCodeDistributionCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the distribution to a single application.
   * When omitted, the distribution covers every application of the owner.
   */
  applicationId?: string;
  /** Start of the time range. */
  from?: Date | string | number;
  /** End of the time range. */
  to?: Date | string | number;
  /**
   * Drop non-standard status codes (lower than 100) from the result.
   * Totals are recomputed over the remaining status codes.
   * @default false
   */
  excludeNonStandardStatusCodes?: boolean;
}>;

export interface GetStatusCodeDistributionCommandOutput {
  /** Distribution per time bucket. */
  byDate: Array<StatusCodeDistributionByDate>;
  /** Distribution aggregated over the whole period, keyed by HTTP status code. */
  byStatusCode: StatusCodeCounts;
}

export interface StatusCodeCounts {
  /** Total number of requests across all status codes. */
  // transformed: summed over the kept status codes, the payload does not carry it
  total: number;
  /** Request count keyed by HTTP status code. */
  // transformed: converted from an array of { code, count } to a record keyed by code
  statuses: Record<number, number>;
}

export interface StatusCodeDistributionByDate extends StatusCodeCounts {
  /** Date of the time bucket, as an ISO 8601 string. */
  // transformed: converted to an ISO date string
  date: string;
}
