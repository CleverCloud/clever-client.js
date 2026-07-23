import type { MFAKind } from './auth.types.js';

/**
 * Which factor to turn off, and the password proving the caller owns the account.
 */
export interface DeleteAuthMfaCommandInput {
  /** Kind of second factor to turn off. */
  kind: MFAKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}
