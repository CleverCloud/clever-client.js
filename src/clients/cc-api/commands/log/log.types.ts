export interface ApplicationRuntimeLog {
  id: string;
  applicationId: string;
  commitId: string;
  deploymentId: string;
  instanceId: string;
  date: string;
  zone: string;
  pid: number;
  facility: number;
  severity: string;
  priority: number;
  version: string;
  service: string;
  message: string;
}

export interface AddonRuntimeLog {
  id: string;
  // renamed from resourceId
  addonId: string;
  hostname: string;
  instanceId: string;
  date: string;
  zone: string;
  pid: number;
  facility: string;
  severity: string;
  service: string;
  message: string;
}

export type ApplicationAccessLog = ApplicationAccessLogHttp;

export interface ApplicationAccessLogBase<T> {
  id: string;
  date: string;
  applicationId: string;
  instanceId: string;
  requestId: string;
  bytesIn: number;
  bytesOut: number;
  source: AccessLogPeer;
  destination: AccessLogPeer;
  tls?: string;
  zone: string;
  detail: T;
}

export interface AccessLogPeer {
  city: string;
  countryCode: string;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  ip: string;
  port: number;
}

export interface ApplicationAccessLogHttp extends ApplicationAccessLogBase<ApplicationAccessLogHttpDetail> {
  type: 'http';
}

export interface ApplicationAccessLogHttpDetail {
  request: {
    host: string;
    method: string;
    path: string;
    scheme: string;
  };
  response: {
    statusCode: number;
    time: number;
  };
}
