import type { Invoice } from '../invoice/invoice.types.js';

export interface AuthorizeStripeCommandInput {
  ownerId: string;
  invoiceNumber: string;
  intentId: string;
}

export type AuthorizeStripeCommandOutput = Invoice;
