export interface GetStripeIntentCommandInput {
  ownerId: string;
}

export interface GetStripeIntentCommandOutput {
  id: string;
  clientSecret: string;
  customer: string;
}
