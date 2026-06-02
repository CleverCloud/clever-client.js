export interface InitPaypalCommandInput {
  ownerId: string;
  invoiceNumber: string;
}

export interface InitPaypalCommandOutput {
  url: string;
}
