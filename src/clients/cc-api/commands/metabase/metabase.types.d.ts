import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface MetabaseInfo {
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
  environment: Array<EnvironmentVariable>;
}
