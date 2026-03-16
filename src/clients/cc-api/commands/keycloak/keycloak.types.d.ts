import { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface KeycloakInfo {
  id: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  version: string;
  javaVersion: string;
  accessUrl: string;
  initialCredentials: {
    user: string;
    password: string;
  };
  availableVersions: string[];
  resources: {
    entrypoint: string;
    fsbucketId: string;
    pgsqlId: string;
  };
  features: {
    networkGroup?: { id: string };
  };
  environment: Array<EnvironmentVariable>;
}
