import type { MFAKind } from './auth.types.js';

export interface GetAuthMfaBackupCodesCommandInput {
  kind: MFAKind;
  password: string;
}

// transformed from Array<{ code: string }>
export type GetAuthMfaBackupCodesCommandOutput = Array<string>;
