import { describe, expect, it } from 'vitest';
import { transformPostgresqlInfo } from '../../../../../../src/clients/cc-api/commands/postgresql/postgresql-transform.ts';

function payload(overrides: Record<string, unknown> = {}) {
  return {
    id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
    app_id: 'addon_xxx',
    owner_id: 'orga_1',
    plan: 'xs_sml',
    zone: 'par',
    creation_date: '2024-01-01T12:00:00.123456Z[UTC]',
    status: 'ACTIVE',
    host: 'babc-postgresql.services.clever-cloud.com',
    user: 'uxyz',
    password: 'clearpw',
    port: 5432,
    database: 'babc',
    version: '17',
    features: [
      { name: 'encryption', enabled: true },
      { name: 'direct-host-only', enabled: false },
      { name: 'do-backup', enabled: true },
    ],
    read_only_users: [
      { user: 'ro_b', password: 'pw_b' },
      { user: 'ro_a', password: 'pw_a' },
    ],
    locale: 'en_GB',
    ...overrides,
  };
}

describe('postgresql-transform', () => {
  describe('transformPostgresqlInfo', () => {
    it('should map the add-on', () => {
      const info = transformPostgresqlInfo(payload());

      expect(info).toEqual({
        id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
        addonId: 'addon_xxx',
        ownerId: 'orga_1',
        plan: 'xs_sml',
        zone: 'par',
        version: '17',
        status: 'ACTIVE',
        createdAt: '2024-01-01T12:00:00.123Z',
        deletedAt: undefined,
        host: 'babc-postgresql.services.clever-cloud.com',
        port: 5432,
        database: 'babc',
        user: 'uxyz',
        password: 'clearpw',
        locale: 'en_GB',
        features: [
          { name: 'direct-host-only', isEnabled: false },
          { name: 'do-backup', isEnabled: true },
          { name: 'encryption', isEnabled: true },
        ],
        readOnlyUsers: [
          { user: 'ro_a', password: 'pw_a' },
          { user: 'ro_b', password: 'pw_b' },
        ],
      });
    });

    // the provider renders its dates as Java's ISO_ZONED_DATE_TIME, `[UTC]` after the offset in production
    it('should read a date carrying the UTC region id', () => {
      const info = transformPostgresqlInfo(payload({ deletion_date: '2024-06-30T23:59:59Z[UTC]' }));

      expect(info.deletedAt).toBe('2024-06-30T23:59:59.000Z');
    });

    // owner_id, deletion_date and locale are omitted from the payload when absent, locale for a shared plan
    it('should leave the optional fields absent when the API omits them', () => {
      const { owner_id, locale, ...rest } = payload();
      const info = transformPostgresqlInfo(rest);

      expect(info.ownerId).toBeUndefined();
      expect(info.deletedAt).toBeUndefined();
      expect(info.locale).toBeUndefined();
    });
  });
});
