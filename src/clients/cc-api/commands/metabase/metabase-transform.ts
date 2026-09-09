import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import type { CheckMetabaseVersionCommandOutput } from './check-metabase-version-command.types.js';
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
    resources: {
      entrypoint: response.resources.entrypoint,
      pgsqlId: response.resources.pgsqlId ?? undefined,
    },
    environment: sortBy(toArray(response.envVars), 'name'),
  };
}

export function transformMetabaseVersionCheck(response: any): CheckMetabaseVersionCommandOutput {
  return {
    installed: response.installed,
    availableVersions: response.available,
    latest: response.latest,
    needUpdate: response.needUpdate,
  };
}
