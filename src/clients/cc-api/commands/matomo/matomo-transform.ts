import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import type { MatomoInfo } from './matomo.types.js';

export function transformMatomoInfo(payload: any): MatomoInfo {
  return {
    id: payload.resourceId,
    addonId: payload.addonId,
    name: payload.name,
    ownerId: payload.ownerId,
    plan: payload.plan,
    version: payload.version,
    phpVersion: payload.phpVersion,
    accessUrl: payload.accessUrl,
    availableVersions: payload.availableVersions,
    resources: payload.resources,
    environment: sortBy(toArray(payload.envVars), 'name'),
  };
}
