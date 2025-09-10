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
  };
  // renamed from envVars. transformed from Record<string, string> to Array<EnvironmentVariable>
  environment: Array<EnvironmentVariable>;
}
