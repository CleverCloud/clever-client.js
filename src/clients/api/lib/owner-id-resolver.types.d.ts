export interface OwnerIdIndex {
  applicationIds: Record<string, string>;
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
}

export interface OwnerIdIndexStore {
  write(index: OwnerIdIndex): Promise<void>;
  read(): Promise<OwnerIdIndex>;
}

export interface Summary {
  user: SummaryOrganisation;
  organisations: Array<SummaryOrganisation>;
}

export interface SummaryOrganisation {
  id: string;
  name: string;
  avatar: string;
  applications: Array<SummaryApplication>;
  addons: Array<SummaryAddon>;
  consumers: Array<SummaryConsumer>;
  providers: Array<SummaryProvider>;
  role: 'ADMIN';
  vatState: string;
  canPay: boolean;
  canSEPA: boolean;
  cleverEnterprise: boolean;
  emergencyNumber: string;
  isTrusted: boolean;
}

export interface SummaryApplication {
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

export interface SummaryAddon {
  id: string;
  name: string;
  realId: string;
  providerId: string;
  logoUrl: string;
  systemTags: Array<string>;
  customerTags: Array<string>;
}

export interface SummaryConsumer {
  name: string;
  key: string;
  picture: string;
}

export interface SummaryProvider {
  id: string;
  name: string;
}
