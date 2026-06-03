import type { OAuthTokens } from '../oauth.types.js';
import type { RetryConfiguration } from './streams.types.js';

export interface ApplicationLogsStreamParams extends ApplicationLogStreamOptions {
  apiHost: string;
  tokens: OAuthTokens;
  ownerId: string;
  appId: string;
  retryConfiguration?: RetryConfiguration;
  connectionTimeout?: number;
}

export interface ApplicationLogStreamOptions {
  since?: Date;
  until?: Date;
  limit?: number;
  deploymentId?: string;
  filter?: string;
  instanceId?: Array<string>;
  field?: Array<string>;
  throttleElements?: number;
  throttlePerInMilliseconds?: number;
}

export interface ApplicationLog {
  applicationId: string;
  commitId: string;
  date: Date;
  deploymentId: string;
  id: string;
  instanceId: string;
  message: string;
  priority: number;
  region: string;
  service: string;
  severity: string;
  version: string;
  zone: string;
}
