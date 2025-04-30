import type { MFAKind } from './auth.types.js';

export interface DeleteAuthMfaCommandInput {
  kind: MFAKind;
  password: string;
}
