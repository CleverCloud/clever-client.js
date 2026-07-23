import type { InvoiceSummary } from './invoice.types.js';

/**
 * Identifies the organisation whose unpaid invoices are listed.
 */
export interface ListUnpaidInvoiceCommandInput {
  /** Identifier of the organisation the invoices were issued to. */
  ownerId: string;
}

/**
 * The invoices of the organisation that are `PENDING`, `PROCESSING` or `PAYMENTHELD`, whatever the
 * period. Sorted by emission date.
 */
export type ListUnpaidInvoiceCommandOutput = Array<InvoiceSummary>;
