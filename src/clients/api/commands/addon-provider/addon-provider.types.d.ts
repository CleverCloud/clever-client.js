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
  status: 'ALPHA' | 'BETA_PRIV' | 'BETA_PUB' | 'RELEASE' | 'DELETED';
  openInNewTab: boolean;
  canUpgrade: boolean;
  regions: Array<string>;
}

export interface AddonProviderPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  // renamed from price_id
  priceId: string;
  features: Array<AddonProviderFeature>;
  zones: Array<string>;
}

export interface AddonProviderFeature {
  name: string;
  type: AddonProviderFeatureType;
  value: string;
  // renamed from computable_value
  computableValue: string;
  // renamed from name_code
  nameCode: string;
}

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
