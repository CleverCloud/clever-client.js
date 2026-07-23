/**
 * Identifies the add-on whose configuration is downloaded.
 */
export interface GetOtoroshiConfigCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}

/**
 * The configuration document, as raw YAML text.
 */
export type GetOtoroshiConfigCommandOutput = string;
