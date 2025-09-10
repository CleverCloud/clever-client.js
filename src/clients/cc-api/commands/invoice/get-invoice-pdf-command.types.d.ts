export interface GetInvoicePdfCommandInput {
  ownerId: string;
  invoiceNumber: string;
}

export type GetInvoicePdfCommandOutput = Blob;
