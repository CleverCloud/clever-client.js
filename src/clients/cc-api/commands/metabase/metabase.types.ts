import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface MetabaseInfo {
  // renamed from resourceId
  id: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  version: string;
  javaVersion: string;
  accessUrl: string;
  availableVersions: Array<string>;
  resources: {
    entrypoint: string;
    pgsqlId: string | null;
  };
  // renamed from envVars
  // transformed: converted from a Record<string, string> to an array, sorted by name
  environment: Array<EnvironmentVariable>;
}
