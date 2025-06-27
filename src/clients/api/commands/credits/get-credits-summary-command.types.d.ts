export interface GetCreditsSummaryCommandInput {
  ownerId: string;
}

export interface GetCreditsSummaryCommandOutput {
  prepaidCredit: number;
  freeCredit: number;
  currency: string;
}
