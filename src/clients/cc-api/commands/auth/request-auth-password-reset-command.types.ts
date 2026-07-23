/**
 * Who to send the password reset email to, and how the reset should behave.
 */
export interface RequestAuthPasswordResetCommandInput {
  /** Email address of the account to reset. */
  login: string;
  /**
   * Whether resetting the password also invalidates every existing session and token.
   * @sentAs `drop_tokens`
   */
  shouldDropTokens?: boolean;
  /**
   * Identifier of the partner the reset flow should be branded for.
   * @sentAs `partner_id`
   */
  partnerId?: string;
}
