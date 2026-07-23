/**
 * The current password, the one replacing it, and what to do with the existing sessions.
 */
export interface UpdateAuthPasswordCommandInput {
  /** Password currently in use, to prove the caller owns the account. */
  oldPassword: string;
  /** Password to set. */
  newPassword: string;
  /**
   * Whether to invalidate every existing session and token of the account.
   * @sentAs `dropTokens`
   */
  shouldRevokeTokens?: boolean;
}
