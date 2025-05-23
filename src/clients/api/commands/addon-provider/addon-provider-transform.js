/**
 * @import { AddonProviderPlan, AddonProviderFeature } from './addon-provider.types.js';
 */

/**
 * @param {any} payload
 * @returns {AddonProviderPlan}
 */
export function transformAddonProviderPlan(payload) {
  return {
    id: payload.id,
    name: payload.name,
    price: payload.price,
    slug: payload.slug,
    zones: payload.zones,
    priceId: payload.price_id,
    features: payload.features.map(transformAddonProviderFeature),
  };
}

/**
 * @param {any} payload
 * @returns {AddonProviderFeature}
 */
export function transformAddonProviderFeature(payload) {
  return {
    name: payload.name,
    type: payload.type,
    value: payload.value,
    computableValue: payload.computable_value,
    nameCode: payload.name_code,
  };
}
