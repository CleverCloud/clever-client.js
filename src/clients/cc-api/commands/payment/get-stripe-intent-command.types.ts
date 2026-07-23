/**
 * Identifies the organisation the Stripe setup intent is opened for.
 */
export interface GetStripeIntentCommandInput {
  /** Identifier of the organisation a payment method is about to be registered on. */
  ownerId: string;
}

/**
 * What the Stripe JS tools need to collect the payment details in the browser.
 */
export interface GetStripeIntentCommandOutput {
  /** Identifier of the setup intent on the Stripe side, of the form `seti_<id>`. */
  id: string;
  /** Secret the Stripe JS tools confirm the intent with, from the browser. */
  clientSecret: string;
  /** Identifier of the Stripe customer the organisation maps to, of the form `cus_<id>`. */
  customer: string;
}
