export interface LogDrain {
  id: string;
  applicationId: string;
  target: LogDrainTarget;
  kind: LogDrainKind;
  updatedAt: string;
  status: LogDrainStatus;
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

export interface RawHttpDrainTarget {
  type: 'RAW_HTTP';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface SyslogTcpDrainTarget {
  type: 'SYSLOG_TCP';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

export interface SyslogUdpDrainTarget {
  type: 'SYSLOG_UDP';
  url: string;
  // RFC 5424
  structuredDataParameters?: string;
}

export interface DatadogDrainTarget {
  type: 'DATADOG';
  url: string;
}

export interface ElasticsearchDrainTarget {
  type: 'ELASTICSEARCH';
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
  indexPrefix?: string;
}

export interface NewrelicDrainTarget {
  type: 'NEWRELIC';
  url: string;
  apiKey: string;
}
