import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface KeycloakInfo {
  // renamed from resourceId
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
  // renamed from envVars
  // transformed: converted from a Record<string, string> to an array, sorted by name
  environment: Array<EnvironmentVariable>;
}
