import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Identifies the application whose access logs are streamed, and how to narrow the stream down. The owner is
 * resolved automatically when omitted.
 */
export interface StreamApplicationAccessLogCommandInput extends ApplicationId {
  /**
   * Start replaying from this moment.
   * @converted to an ISO date string
   */
  since?: string | number | Date;
  /**
   * Stop the stream once this moment is reached.
   * @converted to an ISO date string
   */
  until?: string | number | Date;
  /**
   * Stop the stream once this many entries have been delivered. The remaining count is recomputed on every
   * reconnection, so a retry does not restart the budget.
   */
  limit?: number;
  /**
   * Restrict the payload of each entry to these fields. Fields left out come back undefined on the resulting access log
   * objects.
   * @sentAs `field`
   * @converted repeated once per field
   */
  fields?: Array<string>;
  /** Maximum number of entries the backend delivers per throttling window. */
  throttleElements?: number;
  /** Length of the throttling window, in milliseconds. */
  throttlePerInMilliseconds?: number;
  /** How long the backend keeps retrying to reconnect the underlying stream before giving up, in seconds. Defaults to 600. */
  maxRetryDurationInSeconds?: number;
}
