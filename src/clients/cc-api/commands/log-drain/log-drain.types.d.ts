export interface LogDrain {
  id: string;
  // renamed from resourceId
  applicationId: string;
  target: LogDrainTarget;
  kind?: LogDrainKind;
  // converted to iso date from status.date
  createdAt: string;
  // converted to iso date from status.date
  lastEdit: string;
  // from status.status
  state: LogDrainState;
  // from status.authorId
  updatedBy?: string;
}

export type LogDrainState = 'CREATED' | 'ENABLED' | 'ENABLING' | 'DISABLING' | 'DISABLED' | 'DELETED';

export type LogDrainKind = 'LOG' | 'ACCESSLOG' | 'AUDITLOG';

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
