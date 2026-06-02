import { sortBy } from '../../../../lib/utils.js';
import type {
  AddonProvider,
  AddonProviderFeature,
  AddonProviderFull,
  AddonProviderPlan,
  AddonProviderPlanFeature,
} from './addon-provider.types.js';

export function transformAddonProviderFull(payload: any): AddonProviderFull {
  return {
    ...transformAddonProvider(payload),
    plans: sortBy(payload.plans.map(transformAddonProviderPlan), 'price'),
    features: sortBy(payload.features.map(transformAddonProviderFeature), 'name'),
  };
}

export function transformAddonProvider(payload: any): AddonProvider {
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

export function transformAddonProviderPlan(payload: any): AddonProviderPlan {
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

export function transformAddonProviderPlanFeature(payload: any): AddonProviderPlanFeature {
  return {
    ...transformAddonProviderFeature(payload),
    value: payload.value,
    // fallback to value when null
    computableValue: payload.computable_value ?? payload.value,
  };
}

export function transformAddonProviderFeature(payload: any): AddonProviderFeature {
  return {
    name: payload.name,
    type: payload.type,
    //fallback to name when null
    nameCode: payload.name_code ?? payload.name,
  };
}
