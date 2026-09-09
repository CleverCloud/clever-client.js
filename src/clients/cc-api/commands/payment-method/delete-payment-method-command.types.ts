/**
 * Identifies the payment method to detach from an organisation.
 */
export interface DeletePaymentMethodCommandInput {
  /** Identifier of the organisation the payment method belongs to. */
  ownerId: string;
  /** Identifier of the payment method on the Stripe side, of the form `pm_<id>`. */
  token: string;
}
