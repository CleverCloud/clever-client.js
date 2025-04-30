export interface OrganisationSummary {
  id: string;
  name: string;
  avatar: string;
  applications: Array<ApplicationSummary>;
  addons: Array<AddonSummary>;
  consumers: Array<ConsumerSummary>;
  providers: Array<ProviderSummary>;
  role: 'ADMIN';
  vatState: string;
  canPay: boolean;
  canSEPA: boolean;
  cleverEnterprise: boolean;
  emergencyNumber: string;
  isPersonal: boolean;
  isTrusted: boolean;
}

export interface ApplicationSummary {
  id: string;
  name: string;
  instanceType: string;
  instanceVariant: string;
  variantSlug: string;
  archived: false;
  homogeneous: false;
  variantLogoUrl: string;
  state: string;
  commit: string;
  systemTags: Array<string>;
  customerTags: Array<string>;
}

export interface AddonSummary {
  id: string;
  name: string;
  realId: string;
  providerId: string;
  logoUrl: string;
  systemTags: Array<string>;
  customerTags: Array<string>;
}

export interface ConsumerSummary {
  name: string;
  key: string;
  picture: string;
}

export interface ProviderSummary {
  id: string;
  name: string;
}
