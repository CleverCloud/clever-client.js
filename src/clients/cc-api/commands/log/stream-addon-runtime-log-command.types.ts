import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the add-on whose runtime logs are streamed, and how to narrow the stream down. The owner is
 * resolved automatically when omitted.
 */
export interface StreamAddonRuntimeLogCommandInput extends AddonId {
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
   * Stop the stream once this many lines have been delivered. The remaining count is recomputed on every
   * reconnection, so a retry does not restart the budget.
   */
  limit?: number;
  /** Keep only the lines emitted during this deployment. */
  deploymentId?: string;
  /** Keep only the lines whose message contains this text. */
  filter?: string;
  /**
   * Keep only the lines emitted by these instances.
   * @sentAs `instanceId`
   * @converted repeated once per instance
   */
  instanceId?: Array<string>;
  /**
   * Restrict the payload of each line to these fields. Fields left out come back undefined on the resulting log
   * objects.
   * @sentAs `field`
   * @converted repeated once per field
   */
  fields?: Array<string>;
  /** Maximum number of lines the backend delivers per throttling window. */
  throttleElements?: number;
  /** Length of the throttling window, in milliseconds. */
  throttlePerInMilliseconds?: number;
}
