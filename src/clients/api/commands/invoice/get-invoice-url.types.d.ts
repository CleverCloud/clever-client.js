export interface GetInvoiceUrlInput {
  ownerId: string;
  invoiceNumber: string;
  format: 'html' | 'pdf';
}
