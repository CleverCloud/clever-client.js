/**
 * The email address to remove from the account.
 */
export interface DeleteProfileEmailAddressCommandInput {
  /** Address to remove. Has to be a secondary address. */
  address: string;
}
