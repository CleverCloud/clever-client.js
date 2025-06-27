export interface AuthorizeStripeCommandInput {
  ownerId: string;
  invoiceNumber: string;
  intentId: string;
}

export interface AuthorizeStripeCommandOutput {}
