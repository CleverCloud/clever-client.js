/**
 * Identifies the billing document to render as PDF.
 */
export interface GetInvoicePdfCommandInput {
  /** Identifier of the organisation the document was issued to. */
  ownerId: string;
  /** Number of the document, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
}

/**
 * The billing document rendered as a PDF file.
 */
export type GetInvoicePdfCommandOutput = Blob;
