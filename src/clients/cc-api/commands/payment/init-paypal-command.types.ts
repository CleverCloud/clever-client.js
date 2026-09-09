/**
 * Identifies the invoice a PayPal payment is opened for.
 */
export interface InitPaypalCommandInput {
  /** Identifier of the organisation the invoice was issued to. */
  ownerId: string;
  /** Number of the invoice to pay, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
}

/**
 * Where the payer has to be sent to approve the payment.
 */
export interface InitPaypalCommandOutput {
  /** PayPal URL the payer is redirected to. */
  url: string;
}
