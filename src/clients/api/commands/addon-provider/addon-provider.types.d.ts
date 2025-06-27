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
  plans: Array<AddonProviderPlan>;
}

export interface AddonProviderPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  // renamed from price_id
  priceId?: string;
  features: Array<AddonProviderFeature>;
  zones: Array<string>;
}

export interface AddonProviderFeature {
  name: string;
  type: AddonProviderFeatureType;
  value: string;
  // renamed from computable_value and fallback to value when null
  computableValue: string;
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
