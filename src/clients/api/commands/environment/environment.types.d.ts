export interface GetEnvironmentCommandOutput {
  environment: Array<EnvironmentVariable>;
  linkedApplicationsEnvironment?: Array<LinkedApplicationEnvironment>;
  linkedAddonsEnvironment?: Array<LinkedAddonEnvironment>;
}

export interface LinkedApplicationEnvironment {
  environment: Array<EnvironmentVariable>;
  applicationId: string;
  applicationName: string;
}

export interface LinkedAddonEnvironment {
  environment: Array<EnvironmentVariable>;
  addonProviderId: string;
  addonId: string;
  addonName: string;
}

export interface EnvironmentVariable {
  name: string;
  value: string;
}
