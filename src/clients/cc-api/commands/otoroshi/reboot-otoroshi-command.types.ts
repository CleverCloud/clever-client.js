/**
 * Identifies the add-on to restart.
 */
export interface RebootOtoroshiCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}
