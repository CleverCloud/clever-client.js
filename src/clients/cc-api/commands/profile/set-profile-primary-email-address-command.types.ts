/**
 * The email address to promote.
 */
export interface SetProfilePrimaryEmailAddressCommandInput {
  /** Address to make primary. It has to already belong to the account and be confirmed. */
  address: string;
}
