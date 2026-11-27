import { normalizeDate, sortBy } from '../../../../lib/utils.ts';
import type { MysqlInfo } from './mysql.types.ts';

export function transformMysqlInfo(payload: any): MysqlInfo {
  return {
    id: payload.id,
    addonId: payload.app_id,
    ownerId: payload.owner_id ?? undefined,
    plan: payload.plan ?? undefined,
    zone: payload.zone,
    version: payload.version,
    status: payload.status ?? undefined,
    createdAt: normalizeUtcDate(payload.creation_date),
    deletedAt: normalizeUtcDate(payload.deletion_date),
    host: payload.host,
    port: payload.port,
    database: payload.database,
    user: payload.user,
    password: payload.password,
    features: sortBy(
      payload.features.map((feature: any) => ({ name: feature.name, isEnabled: feature.enabled })),
      'name',
    ),
    readOnlyUsers: sortBy(
      payload.read_only_users.map((readOnlyUser: any) => ({
        user: readOnlyUser.user,
        password: readOnlyUser.password,
      })),
      'user',
    ),
  };
}

/**
 * The provider serialises its dates without an offset (`2024-01-01T12:00:00.123`), which `Date` would read as local time.
 * They are stored in UTC, so the missing `Z` is added before normalising.
 */
function normalizeUtcDate(date: string | null | undefined): string | undefined {
  if (date == null) {
    return undefined;
  }
  const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/.test(date);
  return normalizeDate(hasOffset ? date : `${date}Z`);
}
