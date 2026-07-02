import type { Invoice } from './invoice.types.js';

export interface GetInvoiceCommandInput {
  ownerId: string;
  invoiceNumber: string;
}

export type GetInvoiceCommandOutput = Invoice;
