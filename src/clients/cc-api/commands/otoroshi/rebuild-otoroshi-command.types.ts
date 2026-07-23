/**
 * Identifies the add-on to rebuild.
 */
export interface RebuildOtoroshiCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}
