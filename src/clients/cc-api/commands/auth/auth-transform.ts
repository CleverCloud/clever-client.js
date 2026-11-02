import type { AuthMfaBackupCodes } from './auth.types.js';

export function transformAuthMfaBackupCodes(payload: any): AuthMfaBackupCodes {
  return {
    backupCodes: payload.backupCodes,
  };
}
