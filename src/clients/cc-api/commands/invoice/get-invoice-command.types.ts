import type { Invoice } from './invoice.types.js';

/**
 * Identifies the billing document to retrieve.
 */
export interface GetInvoiceCommandInput {
  /** Identifier of the organisation the document was issued to. */
  ownerId: string;
  /** Number of the document, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
}

/**
 * The billing document, with all of its detailed lines.
 */
export type GetInvoiceCommandOutput = Invoice;
