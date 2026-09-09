/**
 * Identifies the add-on to take out of its network group.
 */
export interface DeleteOtoroshiNetworkGroupCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}
