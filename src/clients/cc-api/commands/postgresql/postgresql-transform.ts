import { normalizeDate, sortBy } from '../../../../lib/utils.ts';
import type { PostgresqlInfo } from './postgresql.types.ts';

export function transformPostgresqlInfo(payload: any): PostgresqlInfo {
  return {
    id: payload.id,
    addonId: payload.app_id,
    ownerId: payload.owner_id ?? undefined,
    plan: payload.plan,
    zone: payload.zone,
    version: payload.version,
    status: payload.status,
    createdAt: normalizeDate(payload.creation_date)!,
    deletedAt: normalizeDate(payload.deletion_date),
    host: payload.host,
    port: payload.port,
    database: payload.database,
    user: payload.user,
    password: payload.password,
    locale: payload.locale ?? undefined,
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
