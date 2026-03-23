/**
 * @import { OtoroshiInfo } from './otoroshi.types.js';
 */

import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';

/**
 * @param {any} response
 * @returns {OtoroshiInfo}
 */
export function transformOtoroshiInfo(response) {
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
    environment: sortBy(toArray(response.envVars), 'name'),
  };
}
