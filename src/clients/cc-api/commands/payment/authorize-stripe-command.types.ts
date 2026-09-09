import type { Invoice } from '../invoice/invoice.types.js';

/**
 * Identifies the Stripe payment intent to confirm, and the invoice it pays.
 */
export interface AuthorizeStripeCommandInput {
  /** Identifier of the organisation the invoice was issued to. */
  ownerId: string;
  /** Number of the invoice being paid, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
  /** Identifier of the Stripe payment intent, of the form `pi_<id>`. */
  intentId: string;
}

/**
 * The invoice as it stands once the payment was verified, `PAID` when it went through.
 */
export type AuthorizeStripeCommandOutput = Invoice;
