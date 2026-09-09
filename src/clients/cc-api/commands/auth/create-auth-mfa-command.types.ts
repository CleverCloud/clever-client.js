import type { MfaKind } from './auth.types.js';

/**
 * Which factor to enrol into, and the password proving the caller owns the account.
 */
export interface CreateAuthMfaCommandInput {
  /** Kind of second factor to enrol into. */
  kind: MfaKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}

/**
 * The enrolment secret handed to the authenticator app.
 */
export interface CreateAuthMfaCommandOutput {
  /** `otpauth://` URL holding the shared secret, usually rendered as a QR code. */
  url: string;
}
