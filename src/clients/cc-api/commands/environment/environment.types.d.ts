import { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface GetEnvironmentCommandOutput {
  environment: Array<EnvironmentVariable>;
  linkedApplicationsEnvironment?: Array<LinkedApplicationEnvironment>;
  linkedAddonsEnvironment?: Array<LinkedAddonEnvironment>;
}

export interface LinkedApplicationEnvironment {
  applicationId: string;
  applicationName: string;
  environment: Array<EnvironmentVariable>;
}

export interface LinkedAddonEnvironment {
  addonId: string;
  addonName: string;
  addonProviderId: string;
  environment: Array<EnvironmentVariable>;
}
