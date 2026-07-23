import type { Invoice } from '../invoice/invoice.types.js';

/**
 * Identifies the invoice a Stripe payment is opened for.
 */
export interface InitStripeCommandInput {
  /** Identifier of the organisation the invoice was issued to. */
  ownerId: string;
  /** Number of the invoice to pay, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
}

/**
 * The invoice as it stands once the charge was attempted. It may already be `PAID`, or still need
 * the payer to confirm the intent.
 */
export type InitStripeCommandOutput = Invoice;
