import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

/**
 * Identifies whose requests the heat map covers, and over which time range. The owner is resolved
 * automatically when omitted.
 */
export type GetHeatMapCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the heat map to a single application.
   * When omitted, the heat map covers every application of the owner.
   */
  applicationId?: string;
  /** Start of the time range. Defaults to 24 hours before the end of the range. */
  from?: Date | string | number;
  /** End of the time range. Defaults to the start of the current hour. */
  to?: Date | string | number;
}>;

/**
 * The heat map, one entry per geographic cell that saw at least one request over the range.
 */
export type GetHeatMapCommandOutput = Array<HeatMapPoint>;

/**
 * One cell of a request heat map: how many requests came from a roughly 39 km wide area, and where the centre
 * of that area is.
 */
export interface HeatMapPoint {
  /** Latitude of the centre of the geographic cell the requests were aggregated into. */
  lat: number;
  /**
   * Longitude of the centre of the geographic cell the requests were aggregated into.
   * @renamedFrom `long`
   */
  lon: number;
  /**
   * Number of requests originating from this geographic cell over the time range.
   * @renamedFrom `accessCount`
   */
  count: number;
}
