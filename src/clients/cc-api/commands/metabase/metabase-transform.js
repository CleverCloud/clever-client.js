/**
 * @import { MetabaseInfo } from './metabase.types.js';
 */

import { sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';

/**
 * @param {any} response
 * @returns {MetabaseInfo}
 */
export function transformMetabaseInfo(response) {
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
