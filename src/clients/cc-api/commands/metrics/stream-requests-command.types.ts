import type { MaybeWithOwnerId } from '../../types/cc-api.types.js';

/**
 * Identifies whose live requests are streamed. The owner is resolved automatically when omitted.
 */
export type StreamRequestsCommandInput = MaybeWithOwnerId<{
  /**
   * Restrict the stream to a single application.
   * When omitted, the stream covers every application of the owner.
   */
  applicationId?: string;
}>;

/**
 * One cell of a live request batch: how many requests came from a roughly 39 km wide area during the batch
 * window, and where the centre of that area is.
 */
export interface RequestLocation {
  /** Latitude of the centre of the geographic cell the requests were aggregated into. */
  lat: number;
  /**
   * Longitude of the centre of the geographic cell the requests were aggregated into.
   * @renamedFrom `long`
   */
  lon: number;
  /** Most frequent city among the requests aggregated into this geographic cell. */
  city: string;
  /**
   * Number of requests originating from this geographic cell during the batch window.
   * @renamedFrom `accessCount`
   */
  count: number;
}
