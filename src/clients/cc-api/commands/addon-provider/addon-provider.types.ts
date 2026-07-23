export interface AddonProviderFull extends AddonProvider {
  // transformed: sorted by price
  plans: Array<AddonProviderPlan>;
  // transformed: sorted by name
  features: Array<AddonProviderFeature>;
}

export interface AddonProvider {
  id: string;
  name: string;
  website: string;
  supportEmail: string;
  googlePlusName: string;
  twitterName: string;
  analyticsId: string;
  // renamed from shortDesc
  shortDescription: string;
  // renamed from longDesc
  longDescription: string;
  logoUrl: string;
  status: AddonProviderStatus;
  // renamed from openInNewTab
  shouldOpenInNewTab: boolean;
  canUpgrade: boolean;
  // renamed from regions
  zones: Array<string>;
}

export interface AddonProviderPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  // renamed from price_id
  // transformed: lowercased
  priceId?: string;
  // transformed: sorted by name
  features: Array<AddonProviderPlanFeature>;
  zones: Array<string>;
}

export interface AddonProviderPlanFeature extends AddonProviderFeature {
  value: string;
  // renamed from computable_value
  // transformed: falls back to value when null
  computableValue: string;
}

export interface AddonProviderFeature {
  name: string;
  type: AddonProviderFeatureType;
  // renamed from name_code
  // transformed: falls back to name when null
  nameCode: string;
}

export type AddonProviderStatus = 'ALPHA' | 'BETA_PRIV' | 'BETA_PUB' | 'RELEASE' | 'DELETED';

export type AddonProviderFeatureType =
  | 'BOOLEAN'
  | 'INTERVAL'
  | 'FILESIZE'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'STRING'
  | 'OBJECT'
  | 'BYTES'
  | 'BOOLEAN_SHARED';
