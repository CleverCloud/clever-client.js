import type { InvoiceSummary } from './invoice.types.js';

/**
 * Narrows down which billing documents of an organisation are listed.
 */
export interface ListInvoiceCommandInput {
  /** Identifier of the organisation the documents were issued to. */
  ownerId: string;
  /**
   * Only keep the documents issued from this date on. Defaults, on the API side, to the beginning of the current year.
   * @converted to an ISO date string
   */
  since?: string | number | Date;
  /**
   * Only keep the documents issued up to this date. Defaults, on the API side, to now.
   * @converted to an ISO date string
   */
  until?: string | number | Date;
  /** How many documents to return at most. Defaults, on the API side, to 1000. */
  limit?: number;
}

/**
 * The invoices and credit notes of the organisation over the period. Sorted by emission date.
 */
export type ListInvoiceCommandOutput = Array<InvoiceSummary>;
