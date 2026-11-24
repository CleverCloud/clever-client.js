import { normalizeDate, sortBy } from '../../../../lib/utils.ts';
import type { RedisInfo } from './redis.types.ts';

export function transformRedisInfo(payload: any): RedisInfo {
  return {
    id: payload.id,
    addonId: payload.app_id,
    ownerId: payload.owner_id ?? undefined,
    plan: payload.plan,
    zone: payload.zone,
    version: payload.version,
    status: payload.status,
    role: payload.role,
    createdAt: normalizeDate(payload.creation_date)!,
    deletedAt: normalizeDate(payload.deletion_date),
    port: payload.port,
    features: sortBy(
      payload.features.map((feature: any) => ({ name: feature.name, isEnabled: feature.enabled })),
      'name',
    ),
  };
}
