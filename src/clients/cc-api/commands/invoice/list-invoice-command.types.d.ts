import { type InvoiceSummary } from './invoice.types.js';

export interface ListInvoiceCommandInput {
  ownerId: string;
  since?: string | number | Date;
  until?: string | number | Date;
  limit?: number;
}

export type ListInvoiceCommandOutput = Array<InvoiceSummary>;
