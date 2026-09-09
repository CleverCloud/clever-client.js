/**
 * The email addresses of the signed-in user, with the primary one told apart from the rest.
 */
export interface ListProfileEmailAddressCommandOutput {
  /** The address notifications and invoices are sent to. */
  primaryAddress: ProfileEmailAddress;
  /** The other addresses of the account, sorted. Always confirmed, since an unconfirmed one is not listed. */
  secondaryAddresses: Array<ProfileEmailAddress>;
}

/**
 * One email address of an account, and whether it has been confirmed.
 */
export interface ProfileEmailAddress {
  /** The address itself. */
  address: string;
  /** Whether the address has been confirmed by following the link sent to it. */
  isVerified: boolean;
}
