import type { MfaKind } from './auth.types.js';

/**
 * The enrolment to confirm, and the proof that it works.
 */
export interface ConfirmAuthMfaCommandInput {
  /** Kind of second factor being confirmed. */
  kind: MfaKind;
  /** Code produced by the authenticator app from the enrolment secret. */
  code: string;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
  /**
   * Whether to invalidate every other session and token of the account.
   * @sentAs `revokeTokens`
   */
  shouldRevokeTokens?: boolean;
}
