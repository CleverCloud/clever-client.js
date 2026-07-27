import type { Invoice } from '../invoice/invoice.types.js';

/**
 * Identifies the invoice a Stripe payment is opened for, and the payment method the charge is
 * attempted on.
 */
export interface InitStripeCommandInput {
  /** Identifier of the organisation the invoice was issued to. */
  ownerId: string;
  /** Number of the invoice to pay, of the form `YYYYMMDDNNNN`. */
  invoiceNumber: string;
  /** Payment method the invoice is charged on: an already-registered one, or a brand new one. */
  paymentMethod: InitStripePaymentMethod;
}

/**
 * The payment method a Stripe charge is opened on. The `kind` field discriminates the two shapes.
 */
export type InitStripePaymentMethod = ExistingStripePaymentMethod | NewStripePaymentMethod;

/**
 * An already-registered payment method of the organisation, charged by its Stripe identifier.
 */
export interface ExistingStripePaymentMethod {
  /** Marks the payment method as already registered. @sentAs `type` with the wire value `EXISTING_CARD` */
  kind: 'EXISTING';
  /** Identifier of the registered payment method to charge, of the form `pm_<id>`. @sentAs `token` */
  paymentMethodId: string;
}

/**
 * A brand new payment method collected in the browser, not yet registered on the organisation.
 */
export interface NewStripePaymentMethod {
  /** Marks the payment method as newly collected. @sentAs `type` with the wire value `NEW_CARD` */
  kind: 'NEW';
  /** One-time Stripe token standing for the collected payment method. */
  token: string;
  /** Opaque device fingerprint Stripe uses for fraud checks. */
  deviceData: string;
}

/**
 * The invoice as it stands once the charge was attempted. It may already be `PAID`, or still need
 * the payer to confirm the intent.
 */
export type InitStripeCommandOutput = Invoice;
