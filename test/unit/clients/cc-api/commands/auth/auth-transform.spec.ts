import { describe, expect, it } from 'vitest';
import { transformAuthMfa } from '../../../../../../src/clients/cc-api/commands/auth/auth-transform.ts';

describe('transformAuthMfa', () => {
  it('should publish the backup codes state of an active factor', () => {
    const mfa = transformAuthMfa({
      kind: 'TOTP',
      configured: true,
      backupCodesState: { remaining: 7, total: 10, generatedAt: '2026-10-26T10:00:00Z' },
    });

    expect(mfa).toEqual({
      kind: 'TOTP',
      isConfigured: true,
      backupCodesState: { remaining: 7, total: 10, generatedAt: '2026-10-26T10:00:00.000Z' },
    });
  });

  it('should leave the backup codes state undefined when the factor is not active', () => {
    expect(transformAuthMfa({ kind: 'TOTP', configured: false }).backupCodesState).toBeUndefined();
    expect(
      transformAuthMfa({ kind: 'TOTP', configured: false, backupCodesState: null }).backupCodesState,
    ).toBeUndefined();
  });
});
