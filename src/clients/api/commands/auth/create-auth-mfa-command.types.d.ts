import type { MFAKind } from './auth.types.js';

export interface CreateAuthMfaCommandInput {
  kind: MFAKind;
}

export interface CreateAuthMfaCommandOutput {
  url: string;
}
