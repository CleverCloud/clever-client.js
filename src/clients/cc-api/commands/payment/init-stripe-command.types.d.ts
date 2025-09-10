import type { Invoice } from '../invoice/invoice.types.js';

export interface InitStripeCommandInput {
  ownerId: string;
  invoiceNumber: string;
}

export type InitStripeCommandOutput = Invoice;
