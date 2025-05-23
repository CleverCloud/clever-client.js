import type { MFAKind } from './auth.types.js';

export interface GetAuthMfaBackupCodesCommandInput {
  kind: MFAKind;
}

export interface GetAuthMfaBackupCodesCommandOutput {
  secret: string;
  // transform Array<{ code: string }} into Array<string>
  recoveryCodes: Array<string>;
}
