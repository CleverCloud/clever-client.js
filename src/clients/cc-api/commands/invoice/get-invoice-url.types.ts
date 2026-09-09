/**
 * Identifies the billing document to build a download URL for, and the format to ask for.
 */
export interface GetInvoiceUrlInput {
  /** Identifier of the organisation the document was issued to. */
  ownerId: string;
  /** Number of the document, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
  /** Extension the URL ends with, which decides how the document is rendered. */
  format: 'html' | 'pdf';
}
