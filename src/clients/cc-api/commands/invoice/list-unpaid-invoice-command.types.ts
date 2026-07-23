import type { InvoiceSummary } from './invoice.types.js';

export interface ListUnpaidInvoiceCommandInput {
  ownerId: string;
}

// transformed: sorted by emittedAt
export type ListUnpaidInvoiceCommandOutput = Array<InvoiceSummary>;
