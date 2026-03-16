import type { EnvironmentVariable } from '../../../../utils/environment.types.js';

export interface OtoroshiInfo {
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
    redisId: string;
    pulsarId: string | null;
    elasticId: string | null;
  };
  features: {
    networkGroup: { id: string } | null;
  };
  api: {
    url: string;
    user: string;
    secret: string;
    openapi: string;
  };
  initialCredentials: {
    user: string;
    password: string;
  };
  environment: Array<EnvironmentVariable>;
}
