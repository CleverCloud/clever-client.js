import type { PaymentMethod } from './payment-method.types.js';

/**
 * Identifies the organisation whose payment methods are listed.
 */
export interface ListPaymentMethodCommandInput {
  /** Identifier of the organisation whose payment methods are listed. */
  ownerId: string;
}

/**
 * The payment methods registered on the organisation.
 */
export type ListPaymentMethodCommandOutput = Array<PaymentMethod>;
