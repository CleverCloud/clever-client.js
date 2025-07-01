import type { MFAKind } from './auth.types.js';

export interface GetAuthMfaBackupCodesCommandInput {
  kind: MFAKind;
  password: string;
}

// transform Array<{ code: string }} into Array<string>
export type GetAuthMfaBackupCodesCommandOutput = Array<string>;
