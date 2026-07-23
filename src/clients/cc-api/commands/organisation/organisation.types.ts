import type { MFAKind } from '../auth/auth.types.js';

export interface OrganisationSummary {
  id: string;
  name: string;
  avatar: string;
  // transformed: sorted by name, then id
  applications: Array<ApplicationSummary>;
  // transformed: sorted by name, then id
  addons: Array<AddonSummary>;
  // transformed: sorted by name, then key
  consumers: Array<ConsumerSummary>;
  // transformed: sorted by name, then id
  providers: Array<ProviderSummary>;
  role: 'NONE' | 'ADMIN' | 'ACCOUNTING' | 'DEVELOPER' | 'MANAGER';
  vatState: string;
  canPay: boolean;
  // renamed from canSEPA
  canPayWithSEPA: boolean;
  // renamed from cleverEnterprise
  isPremium: boolean;
  emergencyNumber: string;
  // transformed: true for the summary built from the payload's user, the payload does not carry it
  isPersonal: boolean;
  isTrusted: boolean;
}

export interface ApplicationSummary {
  id: string;
  name: string;
  instanceType: string;
  instanceVariant: string;
  variantSlug: string;
  // renamed from archived
  isArchived: boolean;
  // renamed from homogeneous
  // transformed: inverted boolean
  isZeroDowntimeDeploymentEnabled: boolean;
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
  // renamed from VAT
  vat: string;
  avatar: string;
  vatState: 'INVALID' | 'PENDING_VALIDATION' | 'VALID' | 'NOT_NEEDED' | 'NOT_APPLICABLE';
  customerFullName: string;
  canPay: boolean;
  // renamed from cleverEnterprise
  isPremium: boolean;
  emergencyNumber: string;
  // renamed from canSEPA
  canPayWithSEPA: boolean;
  isTrusted: boolean;
}

export interface OrganisationMember {
  // renamed from member.id
  id: string;
  // renamed from member.email
  emailAddress: string;
  // renamed from member.name
  name: string;
  // renamed from member.avatar
  avatar: string;
  // renamed from member.preferredMFA
  preferredMFA: MFAKind;
  role: OrganisationMemberRole;
  // renamed from job
  jobTitle?: string;
}

export type OrganisationMemberRole = 'NONE' | 'ADMIN' | 'ACCOUNTING' | 'DEVELOPER' | 'MANAGER';
