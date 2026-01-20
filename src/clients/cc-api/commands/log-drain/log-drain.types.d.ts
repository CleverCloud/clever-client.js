export interface LogDrain {
  id: string;
  // renamed from resourceId
  applicationId: string;
  target: LogDrainTarget;
  kind: LogDrainKind;
  // renamed from status.date (Converted ISO date when the drain's current status was set)
  updatedAt: string;
  // renamed from status.status
  status: LogDrainStatus;
  // renamed from status.authorId
  updatedBy: string;
  execution: {
    status: LogDrainExecutionStatus;
    lastError: string;
  };
  backlog: {
    msgRateOut: number;
    msgBacklog: number;
  };
}

export type LogDrainStatus = 'CREATED' | 'ENABLED' | 'ENABLING' | 'DISABLING' | 'DISABLED' | 'DELETED';

export type LogDrainExecutionStatus = 'RUNNING' | 'RETRYING' | 'NOT_RUNNING';

export type LogDrainKind = 'LOG' | 'ACCESSLOG' | 'AUDITLOG';

export type LogDrainTarget =
  | RawHttpDrainTarget
  | SyslogTcpDrainTarget
  | SyslogUdpDrainTarget
  | DatadogDrainTarget
  | ElasticsearchDrainTarget
  | NewrelicDrainTarget;

// renamed from HttpDrainTarget
export interface RawHttpDrainTarget {
  type: 'RAW_HTTP';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
}

// renamed from SyslogTcpDrainTarget (type changed from 'TCPSyslog')
export interface SyslogTcpDrainTarget {
  type: 'SYSLOG_TCP';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

// renamed from SyslogUdpDrainTarget (type changed from 'UDPSyslog')
export interface SyslogUdpDrainTarget {
  type: 'SYSLOG_UDP';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

// renamed from DatadogHttpDrainTarget
export interface DatadogDrainTarget {
  type: 'DATADOG';
  url: string;
}

// renamed from ElasticSearchDrainTarget
export interface ElasticsearchDrainTarget {
  type: 'ELASTICSEARCH';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
  indexPrefix?: string;
}

// renamed from NewRelicHttpDrainTarget
export interface NewrelicDrainTarget {
  type: 'NEWRELIC';
  url: string;
  apiKey: string;
}
