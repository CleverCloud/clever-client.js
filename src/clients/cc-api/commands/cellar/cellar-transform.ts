import { normalizeDate } from '../../../../lib/utils.js';
import type { CellarInfo, CellarObjectList } from './cellar.types.js';

export function transformCellarObjectList(payload: any): CellarObjectList {
  return {
    items: payload.content,
    directories: payload.directories,
    cursor: payload.cursor,
  };
}

export function transformCellarInfo(payload: any): CellarInfo {
  return {
    id: payload.id,
    addonId: payload.addonId,
    name: payload.name,
    ownerId: payload.ownerId,
    plan: payload.plan,
    status: payload.status,
    createdAt: normalizeDate(payload.creationDate)!,
    traffic: payload.traffic,
    buckets: payload.buckets,
  };
}
