/**
 * @import { AddonProvider, AddonProviderFull, AddonProviderPlan, AddonProviderFeature, AddonProviderPlanFeature } from './addon-provider.types.js';
 */

/**
 * @param {any} payload
 * @returns {AddonProviderFull}
 */
export function transformAddonProviderFull(payload) {
  return {
    ...transformAddonProvider(payload),
    plans: payload.plans.map(transformAddonProviderPlan).sort(
      /** @param {AddonProviderPlan} a
       @param {AddonProviderPlan} b
       */ (a, b) => a.price - b.price,
    ),
    features: payload.features.map(transformAddonProviderFeature),
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
    features: payload.features.map(transformAddonProviderPlanFeature),
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
