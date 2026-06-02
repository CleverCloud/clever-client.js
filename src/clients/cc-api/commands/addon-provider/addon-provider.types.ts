export interface AddonProviderFull extends AddonProvider {
  plans: Array<AddonProviderPlan>;
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
  shortDesc: string;
  longDesc: string;
  logoUrl: string;
  status: AddonProviderStatus;
  openInNewTab: boolean;
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
  priceId?: string;
  features: Array<AddonProviderPlanFeature>;
  zones: Array<string>;
}

export interface AddonProviderPlanFeature extends AddonProviderFeature {
  value: string;
  // renamed from computable_value and fallback to value when null
  computableValue: string;
}

export interface AddonProviderFeature {
  name: string;
  type: AddonProviderFeatureType;
  // renamed from name_code and fallback to name when null
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
