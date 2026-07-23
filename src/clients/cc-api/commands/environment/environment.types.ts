import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface GetEnvironmentCommandOutput {
  // transformed: sorted by name
  environment: Array<EnvironmentVariable>;
  // transformed: sorted by applicationName
  linkedApplicationsEnvironment?: Array<LinkedApplicationEnvironment>;
  // transformed: sorted by addonName
  linkedAddonsEnvironment?: Array<LinkedAddonEnvironment>;
}

export interface LinkedApplicationEnvironment {
  // renamed from app_id
  applicationId: string;
  // renamed from app_name
  applicationName: string;
  // renamed from env
  environment: Array<EnvironmentVariable>;
}

export interface LinkedAddonEnvironment {
  // renamed from addon_id
  addonId: string;
  // renamed from addon_name
  addonName: string;
  // renamed from provider_id
  addonProviderId: string;
  // renamed from env
  environment: Array<EnvironmentVariable>;
}
