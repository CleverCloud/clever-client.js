import { type InvoiceSummary } from './invoice.types.js';

export interface ListUnpaidInvoiceCommandInput {
  ownerId: string;
}

export type ListUnpaidInvoiceCommandOutput = Array<InvoiceSummary>;
