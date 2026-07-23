import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface MatomoInfo {
  // renamed from resourceId
  id: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: 'BETA';
  version: string;
  phpVersion: string;
  accessUrl: string;
  availableVersions: Array<string>;
  resources: {
    entrypoint: string;
    mysqlId: string;
    redisId: string;
    kvId?: string;
  };
  // renamed from envVars
  // transformed: converted from a Record<string, string> to an array, sorted by name
  environment: Array<EnvironmentVariable>;
}
