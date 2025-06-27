import type { MFAKind } from './auth.types.js';

export interface ConfirmAuthMfaCommandInput {
  kind: MFAKind;
  code: string;
  revokeTokens?: boolean;
}
