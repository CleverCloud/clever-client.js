/**
 * The VAT number to check, and the country it belongs to.
 */
export interface CheckVatNumberCommandInput {
  /** Two-letter ISO country code, for example `FR`. */
  country: string;
  /** Full VAT number, country prefix included. The prefix is stripped before the number is sent. */
  vatNumber: string;
}

/**
 * The outcome of the check: either the company the number belongs to, or a bare invalid flag.
 */
export type CheckVatNumberCommandOutput = CheckVatNumberValid | CheckVatNumberInvalid;

/**
 * A VAT number known to the registry, with the company it is registered to.
 */
export interface CheckVatNumberValid {
  /** Discriminant marking the number as valid. */
  valid: true;
  /** Registered name of the company. Empty when the registry is not reachable. */
  name: string;
  /** Registered address of the company. Empty when the registry is not reachable. */
  address: string;
}

/**
 * A VAT number the registry rejected. Reduced to the flag: an invalid number carries no name nor
 * address.
 */
export interface CheckVatNumberInvalid {
  /** Discriminant marking the number as invalid. */
  valid: false;
}
