/**
 * Identifies the add-on to rebuild.
 */
export type RebuildKeycloakCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
};
