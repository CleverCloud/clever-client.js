import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

export type StreamRequestsCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the stream to a single application.
   * When omitted, the stream covers every application of the owner.
   */
  applicationId?: string;
}>;

export interface RequestLocation {
  /** Latitude of the geographic cell the requests were aggregated into. */
  lat: number;
  /** Longitude of the geographic cell the requests were aggregated into. */
  lon: number;
  /** Most frequent city among the requests aggregated into this geographic cell. */
  city: string;
  /** Number of requests originating from this geographic cell during the batch window. */
  count: number;
}
