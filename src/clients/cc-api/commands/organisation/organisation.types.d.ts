import type { MFAKind } from '../auth/auth.types.js';

export interface OrganisationSummary {
  id: string;
  name: string;
  avatar: string;
  applications: Array<ApplicationSummary>;
  addons: Array<AddonSummary>;
  consumers: Array<ConsumerSummary>;
  providers: Array<ProviderSummary>;
  role: 'NONE' | 'ADMIN' | 'ACCOUNTING' | 'DEVELOPER' | 'MANAGER';
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

export interface Organisation {
  id: string;
  name: string;
  description: string;
  // renamed from billingEmail
  billingEmailAddress: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  company: string;
  VAT: string;
  avatar: string;
  vatState: 'INVALID' | 'PENDING_VALIDATION' | 'VALID' | 'NOT_NEEDED' | 'NOT_APPLICABLE';
  customerFullName: string;
  canPay: boolean;
  cleverEnterprise: boolean;
  emergencyNumber: string;
  canSEPA: boolean;
  isTrusted: boolean;
}

export interface OrganisationMember {
  id: string;
  email: string;
  name: string;
  avatar: string;
  preferredMFA: MFAKind;
  role: OrganisationMemberRole;
  job?: string;
}

export type OrganisationMemberRole = 'NONE' | 'ADMIN' | 'ACCOUNTING' | 'DEVELOPER' | 'MANAGER';
