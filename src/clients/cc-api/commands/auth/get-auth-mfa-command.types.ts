import type { AuthMfa, MfaKind } from './auth.types.ts';

/**
 * The factor to look up.
 */
export interface GetAuthMfaCommandInput {
  /** Kind of second factor. */
  kind: MfaKind;
}

export type GetAuthMfaCommandOutput = AuthMfa;
