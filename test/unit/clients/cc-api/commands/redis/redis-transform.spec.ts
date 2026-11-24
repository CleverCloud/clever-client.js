import { describe, expect, it } from 'vitest';
import { transformRedisInfo } from '../../../../../../src/clients/cc-api/commands/redis/redis-transform.ts';

function payload(overrides: Record<string, unknown> = {}) {
  return {
    id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
    app_id: 'addon_xxx',
    owner_id: 'orga_1',
    plan: 'S_MONO',
    zone: 'par',
    creation_date: '2024-01-01T12:00:00.123456Z',
    status: 'ACTIVE',
    deletion_date: null,
    port: 40116,
    role: 'master',
    version: '8.10.3',
    features: [{ name: 'encryption', enabled: true }],
    ...overrides,
  };
}

describe('redis-transform', () => {
  describe('transformRedisInfo', () => {
    it('should map the add-on', () => {
      const info = transformRedisInfo(payload());

      expect(info).toEqual({
        id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
        addonId: 'addon_xxx',
        ownerId: 'orga_1',
        plan: 'S_MONO',
        zone: 'par',
        version: '8.10.3',
        status: 'ACTIVE',
        role: 'master',
        createdAt: '2024-01-01T12:00:00.123Z',
        deletedAt: undefined,
        port: 40116,
        features: [{ name: 'encryption', isEnabled: true }],
      });
    });

    it('should map the deletion date', () => {
      const info = transformRedisInfo(payload({ status: 'TO_DELETE', deletion_date: '2024-06-30T23:59:59Z' }));

      expect(info.deletedAt).toBe('2024-06-30T23:59:59.000Z');
    });

    // owner_id is an Option backend side, sent as null when absent
    it('should leave the owner absent when the API sends none', () => {
      const info = transformRedisInfo(payload({ owner_id: null }));

      expect(info.ownerId).toBeUndefined();
    });
  });
});
