import type { MFAKind } from './auth.types.js';

export interface CreateAuthMfaCommandInput {
  kind: MFAKind;
  password: string;
}

export interface CreateAuthMfaCommandOutput {
  url: string;
}
