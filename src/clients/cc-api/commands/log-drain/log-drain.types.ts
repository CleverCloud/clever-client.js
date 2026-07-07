interface LogDrainCommon {
  id: string;
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

export interface LogDrain extends LogDrainCommon {
  applicationId?: string;
  addonId?: string;
}

export type LogDrainStatus = 'CREATED' | 'ENABLED' | 'ENABLING' | 'DISABLING' | 'DISABLED' | 'DELETED';

export type LogDrainExecutionStatus = 'RUNNING' | 'RETRYING' | 'NOT_RUNNING';

export type LogDrainKind = 'LOG' | 'ACCESSLOG' | 'AUDITLOG';

export type LogDrainTarget =
  | RawHttpDrainTarget
  | SyslogTcpDrainTarget
  | SyslogUdpDrainTarget
  | OvhTcpDrainTarget
  | DatadogDrainTarget
  | ElasticsearchDrainTarget
  | NewrelicDrainTarget
  | BetterStackDrainTarget;

export type LogDrainTlsVerification = 'DEFAULT' | 'TRUSTFUL';

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
  rfc5424StructuredDataParameters?: string;
}

export interface SyslogUdpDrainTarget {
  type: 'SYSLOG_UDP';
  url: string;
  // RFC 5424
  rfc5424StructuredDataParameters?: string;
}

export interface OvhTcpDrainTarget {
  type: 'OVH_TCP';
  url: string;
  token?: string;
  // RFC 5424
  rfc5424StructuredDataParameters?: string;
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
  tlsVerification?: LogDrainTlsVerification;
}

export interface NewrelicDrainTarget {
  type: 'NEWRELIC';
  url: string;
  apiKey: string;
}

export interface BetterStackDrainTarget {
  type: 'BETTERSTACK';
  url: string;
  sourceToken: string;
}
