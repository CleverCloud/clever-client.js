/**
 * The email address to add to the account.
 */
export interface CreateProfileEmailAddressCommandInput {
  /** Address to add. It has to be confirmed before it can be made primary. */
  address: string;
}
