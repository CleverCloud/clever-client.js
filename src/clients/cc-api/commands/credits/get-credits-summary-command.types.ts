import type { Credits } from './credits.types.js';

/**
 * Identifies the organisation whose credit balance is read.
 */
export interface GetCreditsSummaryCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The credit balance of the organisation.
 */
export type GetCreditsSummaryCommandOutput = Credits;
