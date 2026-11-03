import { normalizeDate } from '../../../../lib/utils.js';
import type { AuthMfa, AuthMfaBackupCodes } from './auth.types.js';

export function transformAuthMfa(payload: any): AuthMfa {
  const state = payload.backupCodesState;
  return {
    kind: payload.kind,
    isConfigured: payload.configured,
    backupCodesState:
      state == null
        ? undefined
        : {
            remaining: state.remaining,
            total: state.total,
            generatedAt: normalizeDate(state.generatedAt)!,
          },
  };
}

export function transformAuthMfaBackupCodes(payload: any): AuthMfaBackupCodes {
  return {
    backupCodes: payload.backupCodes,
  };
}
