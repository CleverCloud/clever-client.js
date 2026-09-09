/**
 * Identifies the billing document to render as HTML.
 */
export interface GetInvoiceHtmlCommandInput {
  /** Identifier of the organisation the document was issued to. */
  ownerId: string;
  /** Number of the document, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
}

/**
 * The billing document rendered as an HTML page.
 */
export type GetInvoiceHtmlCommandOutput = string;
