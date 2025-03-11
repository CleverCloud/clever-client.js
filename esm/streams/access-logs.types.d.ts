import type { OAuthTokens } from '../oauth.types.js';
import type { RetryConfiguration } from './streams.types.js';

export interface ApplicationAccessLogsStreamParams extends ApplicationAccessLogStreamOptions {
  apiHost: string;
  tokens: OAuthTokens;
  ownerId: string;
  appId: string;
  retryConfiguration: RetryConfiguration;
  connectionTimeout: number;
}

export interface ApplicationAccessLogStreamOptions {
  since: Date;
  until: Date;
  limit: number;
  field: Array<string>;
  throttleElements: number;
  throttlePerInMilliseconds: number;
}

export interface ApplicationAccessLog {
  applicationId: string;
  bytesIn: number;
  bytesOut: number;
  date: Date;
  destination: {
    city: string;
    countryCode: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
    ip: string;
    port: number;
  };
  http: {
    request: {
      host: string;
      method: string;
      path: string;
      scheme: string;
    };
    response: {
      serviceTime: null;
      statusCode: number;
      time: number;
    };
  };
  id: string;
  instanceId: string;
  region: string;
  requestId: string;
  source: {
    city: string;
    countryCode: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
    ip: string;
    port: number;
  };
  tls: null;
  zone: string;
}
