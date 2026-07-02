import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import type { MetabaseInfo } from './metabase.types.js';

export function transformMetabaseInfo(response: any): MetabaseInfo {
  return {
    id: response.resourceId,
    addonId: response.addonId,
    name: response.name,
    ownerId: response.ownerId,
    plan: response.plan,
    version: response.version,
    javaVersion: response.javaVersion,
    accessUrl: response.accessUrl,
    availableVersions: response.availableVersions,
    resources: response.resources,
    environment: sortBy(toArray(response.envVars), 'name'),
  };
}
