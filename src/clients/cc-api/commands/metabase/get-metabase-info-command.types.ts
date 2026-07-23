import type { MetabaseInfo } from './metabase.types.js';

/**
 * Identifies the add-on to retrieve.
 */
export type GetMetabaseInfoCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
};

/**
 * The requested add-on.
 */
export type GetMetabaseInfoCommandOutput = MetabaseInfo;
