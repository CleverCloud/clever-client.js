import type { PaymentMethod } from './payment-method.types.js';

/**
 * Identifies the payment method to charge the invoices of an organisation on.
 */
export interface SetPrimaryPaymentMethodCommandInput {
  /** Identifier of the organisation the payment method belongs to. */
  ownerId: string;
  /** Identifier of the payment method on the Stripe side, of the form `pm_<id>`. */
  id: string;
}

/**
 * The payment method that is now the primary one.
 */
export type SetPrimaryPaymentMethodCommandOutput = PaymentMethod;
