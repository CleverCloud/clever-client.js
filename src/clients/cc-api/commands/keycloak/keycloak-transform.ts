import { sortBy } from '../../../../lib/utils.ts';
import { toArray } from '../../../../utils/environment-utils.ts';
import type { CheckKeycloakVersionCommandOutput } from './check-keycloak-version-command.types.ts';
import type { KeycloakInfo } from './keycloak.types.ts';

export function transformKeycloakInfo(response: any): KeycloakInfo {
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
    features: {
      networkGroup: response.features.networkGroup ?? undefined,
    },
    initialCredentials: response.initialCredentials,
    environment: sortBy(toArray(response.envVars), 'name'),
  };
}

export function transformKeycloakVersionCheck(response: any): CheckKeycloakVersionCommandOutput {
  return {
    installed: response.installed,
    availableVersions: response.available,
    latest: response.latest,
    needUpdate: response.needUpdate,
  };
}
