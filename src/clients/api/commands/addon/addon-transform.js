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
    ...payload,
    creationDate: normalizeDate(payload.creationDate),
    plan: transformAddonProviderPlan(payload.plan),
  };
}
