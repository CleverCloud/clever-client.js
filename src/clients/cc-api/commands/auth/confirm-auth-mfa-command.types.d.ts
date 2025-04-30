import type { MFAKind } from './auth.types.js';

export interface ConfirmAuthMfaCommandInput {
  kind: MFAKind;
  code: string;
  password: string;
  revokeTokens?: boolean;
}
