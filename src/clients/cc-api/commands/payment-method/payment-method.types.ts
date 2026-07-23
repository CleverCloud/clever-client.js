/**
 * A payment method registered on an organisation, held on the Stripe side: a credit card or a SEPA
 * direct debit mandate the invoices of the organisation can be charged on.
 */
export interface PaymentMethod {
  /** Identifier of the organisation the payment method belongs to. */
  ownerId: string;
  /** Kind of payment method: `CREDITCARD` or `SEPA_DEBIT`. */
  type: string;
  /** Identifier of the payment method on the Stripe side, of the form `pm_<id>`. */
  token: string;
  /**
   * Whether this is the payment method the invoices of the organisation are charged on.
   * @renamedFrom `isDefault`
   */
  isPrimary: boolean;
  /** Last four digits of the card number, or of the IBAN for a SEPA direct debit mandate. */
  number: string;
}
