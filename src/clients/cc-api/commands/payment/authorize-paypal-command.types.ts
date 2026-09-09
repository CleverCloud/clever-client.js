import type { Invoice } from '../invoice/invoice.types.js';

/**
 * Identifies the PayPal transaction to capture, and the invoice it pays.
 */
export interface AuthorizePaypalCommandInput {
  /** Identifier of the organisation the invoice was issued to. */
  ownerId: string;
  /** Number of the invoice being paid, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
  /** Identifier of the PayPal transaction, handed back by PayPal once the payer approved it. */
  transactionId: string;
}

/**
 * The invoice as it stands once the transaction was captured, `PAID` when it went through.
 */
export type AuthorizePaypalCommandOutput = Invoice;
