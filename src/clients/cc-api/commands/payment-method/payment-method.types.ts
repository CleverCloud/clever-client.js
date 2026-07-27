/**
 * A payment method registered on an organisation, held on the Stripe side: a credit card or a SEPA
 * direct debit mandate the invoices of the organisation can be charged on.
 *
 * The `type` field discriminates the two shapes.
 */
export type PaymentMethod = CreditCardPaymentMethod | SepaDebitPaymentMethod;

/**
 * Fields shared by every payment method, whatever its kind.
 */
export interface CommonPaymentMethod {
  /** Identifier of the organisation the payment method belongs to. */
  ownerId: string;
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

/**
 * A credit card registered on an organisation.
 */
export interface CreditCardPaymentMethod extends CommonPaymentMethod {
  /** Kind of payment method: always `CREDITCARD` here. */
  type: 'CREDITCARD';
  /** Name of the card holder, absent when Stripe holds none. */
  holderName?: string;
  /**
   * Last day of the month the card expires on, e.g. `2026-07-31` for a card valid through July 2026.
   * @renamedFrom `expirationDate`
   * @converted to an ISO date string
   */
  expiresAt: string;
  /** Whether the card has expired as of now. */
  isExpired: boolean;
  /** Card network as Stripe labels it, e.g. `visa` or `mastercard`. */
  cardType: string;
  /** Networks the card can be charged on, as Stripe labels them. */
  availableNetworks: Array<string>;
  /** Network preferred for charging the card, absent when none is set. */
  preferredNetwork?: string;
}

/**
 * A SEPA direct debit mandate registered on an organisation.
 */
export interface SepaDebitPaymentMethod extends CommonPaymentMethod {
  /** Kind of payment method: always `SEPA_DEBIT` here. */
  type: 'SEPA_DEBIT';
  /** Bank code of the debited account, absent when Stripe holds none. */
  bankCode?: string;
  /** Branch code of the debited account, absent when Stripe holds none. */
  branchCode?: string;
  /** ISO 3166-1 alpha-2 country code of the debited account, e.g. `FR`. */
  country: string;
  /** Stripe fingerprint uniquely identifying the debited account. */
  fingerprint: string;
}
