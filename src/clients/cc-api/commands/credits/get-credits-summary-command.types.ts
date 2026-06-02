import type { Credits } from './credits.types.js';

export interface GetCreditsSummaryCommandInput {
  ownerId: string;
}

export type GetCreditsSummaryCommandOutput = Credits;
