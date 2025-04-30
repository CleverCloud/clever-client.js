export interface LogDrain {
  id: string;
  // renamed from appId
  applicationId: string;
  target: LogDrainTarget;
  // converted to iso date
  createdAt: string;
  // converted to iso date
  lastEdit: string;
  token: string;
  state: LogDrainState;
  updatedBy?: string;
}

export type LogDrainState = 'ENABLED' | 'DISABLED' | 'TO_DELETE' | 'DELETED';

export type LogDrainTarget =
  | HttpDrainTarget
  | SyslogTcpDrainTarget
  | SyslogUdpDrainTarget
  | DatadogHttpDrainTarget
  | ElasticSearchDrainTarget
  | NewRelicHttpDrainTarget;

export interface HttpDrainTarget {
  // renamed from drainType
  type: 'HTTP';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface SyslogTcpDrainTarget {
  type: 'TCPSyslog';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

export interface SyslogUdpDrainTarget {
  type: 'UDPSyslog';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

export interface DatadogHttpDrainTarget {
  type: 'DatadogHTTP';
  url: string;
}

export interface ElasticSearchDrainTarget {
  type: 'ElasticSearch';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
  indexPrefix?: string;
}

export interface NewRelicHttpDrainTarget {
  type: 'NewRelicHTTP';
  url: string;
  apiKey: string;
}
