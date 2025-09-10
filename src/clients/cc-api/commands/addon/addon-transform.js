/**
 * @import { Addon } from './addon.types.js';
 */

import { normalizeDate } from '../../../../lib/utils.js';
import { transformAddonProviderPlan } from '../addon-provider/addon-provider-transform.js';

/**
 * @param {any} payload
 * @returns {Addon}
 */
export function transformAddon(payload) {
  return {
    id: payload.id,
    name: payload.name,
    realId: payload.realId,
    zone: payload.region,
    zoneId: payload.zoneId,
    provider: payload.provider,
    plan: transformAddonProviderPlan(payload.plan),
    creationDate: normalizeDate(payload.creationDate),
    configKeys: payload.configKeys.sort(),
  };
}
