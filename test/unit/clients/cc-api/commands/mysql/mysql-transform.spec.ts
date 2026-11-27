import { describe, expect, it } from 'vitest';
import { transformMysqlInfo } from '../../../../../../src/clients/cc-api/commands/mysql/mysql-transform.ts';

function payload(overrides: Record<string, unknown> = {}) {
  return {
    id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
    app_id: 'addon_xxx',
    owner_id: 'orga_1',
    plan: 'dev',
    zone: 'par',
    creation_date: '2024-01-01T12:00:00.123',
    status: 'ACTIVE',
    deletion_date: null,
    host: 'babc-mysql.services.clever-cloud.com',
    user: 'uxyz',
    password: 'clearpw',
    port: 3306,
    database: 'babc',
    version: '8.4',
    features: [
      { name: 'encryption', enabled: true },
      { name: 'direct-host-only', enabled: false },
    ],
    read_only_users: [
      { user: 'ro_b', password: 'pw_b' },
      { user: 'ro_a', password: 'pw_a' },
    ],
    ...overrides,
  };
}

describe('mysql-transform', () => {
  describe('transformMysqlInfo', () => {
    it('should map the add-on', () => {
      const info = transformMysqlInfo(payload());

      expect(info).toEqual({
        id: '5d9139e1-4a40-4b99-89df-e1c518a0a32c',
        addonId: 'addon_xxx',
        ownerId: 'orga_1',
        plan: 'dev',
        zone: 'par',
        version: '8.4',
        status: 'ACTIVE',
        createdAt: '2024-01-01T12:00:00.123Z',
        deletedAt: undefined,
        host: 'babc-mysql.services.clever-cloud.com',
        port: 3306,
        database: 'babc',
        user: 'uxyz',
        password: 'clearpw',
        features: [
          { name: 'direct-host-only', isEnabled: false },
          { name: 'encryption', isEnabled: true },
        ],
        readOnlyUsers: [
          { user: 'ro_a', password: 'pw_a' },
          { user: 'ro_b', password: 'pw_b' },
        ],
      });
    });

    // the provider sends chrono NaiveDateTime values, with no offset, stored in UTC
    it('should read the dates as UTC, whatever the local time zone', () => {
      const info = transformMysqlInfo(payload({ deletion_date: '2024-06-30T23:59:59' }));

      expect(info.deletedAt).toBe('2024-06-30T23:59:59.000Z');
    });

    it('should keep a date that already carries an offset', () => {
      const info = transformMysqlInfo(payload({ creation_date: '2024-01-01T12:00:00+02:00' }));

      expect(info.createdAt).toBe('2024-01-01T10:00:00.000Z');
    });

    // owner_id, plan, status, creation_date and deletion_date are Option[...] backend side
    it('should leave the optional fields absent when the API sends none', () => {
      const info = transformMysqlInfo(
        payload({ owner_id: null, plan: null, status: null, creation_date: null, deletion_date: null }),
      );

      expect(info.ownerId).toBeUndefined();
      expect(info.plan).toBeUndefined();
      expect(info.status).toBeUndefined();
      expect(info.createdAt).toBeUndefined();
      expect(info.deletedAt).toBeUndefined();
    });
  });
});
