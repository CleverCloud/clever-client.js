import type { CheckOtoroshiVersionCommandOutput } from './check-otoroshi-version-command.types.js';
import type { OtoroshiInfo } from './otoroshi.types.js';

export function transformOtoroshiInfo(response: any): OtoroshiInfo {
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
    api: response.api,
    initialCredentials: response.initialCredentials,
  };
}

export function transformOtoroshiVersionCheck(response: any): CheckOtoroshiVersionCommandOutput {
  return {
    installed: response.installed,
    availableVersions: response.available,
    latest: response.latest,
    needUpdate: response.needUpdate,
  };
}
