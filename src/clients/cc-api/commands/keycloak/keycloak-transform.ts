import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import type { CheckKeycloakVersionCommandOutput } from './check-keycloak-version-command.types.js';
import type { KeycloakInfo } from './keycloak.types.js';

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
    features: response.features,
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
