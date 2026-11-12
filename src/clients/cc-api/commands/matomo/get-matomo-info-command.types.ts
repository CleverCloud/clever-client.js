import type { MatomoInfo } from './matomo.types.ts';

/**
 * Identifies the add-on to retrieve.
 */
export interface GetMatomoInfoCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}

/**
 * The requested add-on.
 */
export type GetMatomoInfoCommandOutput = MatomoInfo;
