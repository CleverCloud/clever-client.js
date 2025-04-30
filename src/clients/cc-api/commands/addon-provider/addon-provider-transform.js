/**
 * @import { AddonProvider, AddonProviderFull, AddonProviderPlan, AddonProviderFeature, AddonProviderPlanFeature } from './addon-provider.types.js';
 */

import { sortBy } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {AddonProviderFull}
 */
export function transformAddonProviderFull(payload) {
  return {
    ...transformAddonProvider(payload),
    plans: sortBy(payload.plans.map(transformAddonProviderPlan), 'price'),
    features: sortBy(payload.features.map(transformAddonProviderFeature), 'name'),
  };
}

/**
 * @param {any} payload
 * @returns {AddonProvider}
 */
export function transformAddonProvider(payload) {
  return {
    id: payload.id,
    name: payload.name,
    website: payload.website,
    supportEmail: payload.supportEmail,
    googlePlusName: payload.googlePlusName,
    twitterName: payload.twitterName,
    analyticsId: payload.analyticsId,
    shortDesc: payload.shortDesc,
    longDesc: payload.longDesc,
    logoUrl: payload.logoUrl,
    status: payload.status,
    openInNewTab: payload.openInNewTab,
    canUpgrade: payload.canUpgrade,
    zones: payload.regions,
  };
}

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
    priceId: payload.price_id?.toLowerCase(),
    features: sortBy(payload.features.map(transformAddonProviderPlanFeature), 'name'),
  };
}

/**
 * @param {any} payload
 * @returns {AddonProviderPlanFeature}
 */
export function transformAddonProviderPlanFeature(payload) {
  return {
    ...transformAddonProviderFeature(payload),
    value: payload.value,
    // fallback to value when null
    computableValue: payload.computable_value ?? payload.value,
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
    //fallback to name when null
    nameCode: payload.name_code ?? payload.name,
  };
}
