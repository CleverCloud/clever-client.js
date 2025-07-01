import type { OAuthTokens } from '../oauth.types.js';
import type { RetryConfiguration } from './streams.types.js';

export interface AuditLogsStreamParams extends AuditLogStreamOptions {
  apiHost: string;
  tokens: OAuthTokens;
  ownerId: string;
  retryConfiguration: RetryConfiguration;
  connectionTimeout: number;
}

export interface AuditLogStreamOptions {
  since: Date;
  until: Date;
  limit: number;
  field: Array<string>;
  throttleElements: number;
  throttlePerInMilliseconds: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  authorizationId: string;
  date: Date;
  client: {
    userAgent: String;
    ip: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
    city: string;
    countryCode: string;
  }
  requestId: string;
  endpoint: {
    method: string;
    domain: string;
    path: string;
  }
}
