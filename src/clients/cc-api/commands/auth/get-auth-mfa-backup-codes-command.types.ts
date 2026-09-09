import type { MfaKind } from './auth.types.js';

/**
 * Which factor the backup codes belong to, and the password proving the caller owns the account.
 */
export interface GetAuthMfaBackupCodesCommandInput {
  /** Kind of second factor the codes back up. */
  kind: MfaKind;
  /** Current account password. Sent base64-encoded in the `X-Clever-Password` header. */
  password: string;
}

/**
 * The backup codes, each usable once. Flattened from the `Array<{ code: string }>` the API returns.
 */
export type GetAuthMfaBackupCodesCommandOutput = Array<string>;
