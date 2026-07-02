import type { Invoice } from '../invoice/invoice.types.js';

export interface AuthorizePaypalCommandInput {
  ownerId: string;
  invoiceNumber: string;
  transactionId: string;
}

export type AuthorizePaypalCommandOutput = Invoice;
