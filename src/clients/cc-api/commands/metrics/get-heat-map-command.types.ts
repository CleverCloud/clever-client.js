import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

export type GetHeatMapCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the heat map to a single application.
   * When omitted, the heat map covers every application of the owner.
   */
  applicationId?: string;
  /** Start of the time range. */
  from?: Date | string | number;
  /** End of the time range. */
  to?: Date | string | number;
}>;

export type GetHeatMapCommandOutput = Array<HeatMapPoint>;

export interface HeatMapPoint {
  /** Latitude of the geographic cell the requests were aggregated into. */
  lat: number;
  /** Longitude of the geographic cell the requests were aggregated into. */
  lon: number;
  /** Number of requests originating from this geographic cell over the time range. */
  count: number;
}
