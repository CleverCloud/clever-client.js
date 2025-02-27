import type { OAuthTokens } from "../oauth.types.js";
import type { RetryConfiguration } from "./streams.types.js";

export interface ResourceLogsStreamParams extends ResourceLogStreamOptions {
  apiHost: string;
  tokens: OAuthTokens;
  ownerId: string;
  addonId: string;
  retryConfiguration: RetryConfiguration;
  connectionTimeout: number;
}

export interface ResourceLogStreamOptions {
  since: Date;
  until: Date;
  limit: number;
  field: Array<string>;
  throttleElements: number;
  throttlePerInMilliseconds: number;
}

export interface ResourceLog {
  date: Date;
  hostname: string;
  id: string;
  instanceId: string;
  message: string;
  region: string;
  resourceId: string;
  service: string;
  severity: string;
  zone: string;
}
