import type { PaymentMethod } from './payment-method.types.js';

/**
 * Identifies the payment method created on the Stripe side to attach to an organisation.
 */
export interface CreatePaymentMethodCommandInput {
  /** Identifier of the organisation to attach the payment method to. */
  ownerId: string;
  /** Identifier of the payment method on the Stripe side, of the form `pm_<id>`. */
  id: string;
}

/**
 * The payment method now attached to the organisation.
 */
export type CreatePaymentMethodCommandOutput = PaymentMethod;
