/**
 * What every log drain carries, whichever kind of resource it is attached to.
 */
interface LogDrainCommon {
  /** Identifier of the drain. */
  id: string;
  /**
   * Where the drain ships the logs, and how it authenticates against it.
   * @renamedFrom `recipient`
   */
  target: LogDrainTarget;
  /** Which stream of logs the drain ships. */
  kind: LogDrainKind;
  /**
   * When the drain's current status was set.
   * @renamedFrom `status.date`
   * @converted to an ISO date string
   */
  updatedAt: string;
  /**
   * Current status of the drain, which says whether it is shipping logs.
   * @renamedFrom `status.status`
   */
  status: LogDrainStatus;
  /**
   * Identifier of the user who last changed the drain's status. Absent when the status was set by the system
   * rather than by a user.
   * @renamedFrom `status.authorId`
   */
  updatedBy?: string;
  /**
   * Why the drain reached its current status, when the transition carried a reason (e.g. an enable/disable
   * triggered by a delivery failure). Absent for plain user-driven transitions.
   * @renamedFrom `status.errorReason`
   */
  errorReason?: string;
  /** How the shipping is going right now. */
  execution: {
    /** Whether the drain is currently shipping, retrying after a failure, or stopped. */
    status: LogDrainExecutionStatus;
    /** Error the last failed delivery attempt reported. Absent when no attempt has failed. */
    lastError?: string;
    /** Number of delivery attempts made in the current retry streak. Absent when the drain is not running. */
    attempt?: number;
    /** Maximum number of delivery attempts before the drain gives up. Absent when the drain is not running. */
    maxAttempt?: number;
    /**
     * When the last delivery attempt was made. Only set while the drain is retrying.
     * @converted to an ISO date string
     */
    lastAttemptAt?: string;
    /**
     * When the next delivery attempt is scheduled, computed from the retry backoff. Only set while the drain is
     * retrying.
     * @converted to an ISO date string
     */
    nextAttemptAt?: string;
    /**
     * When the current retry streak started. Absent when the drain is not retrying.
     * @converted to an ISO date string
     */
    retryingSince?: string;
  };
  /** How far behind the drain is on the messages it has to ship. Absent when the drain has no stats yet. */
  backlog?: {
    /** Rate at which messages are currently leaving the drain's queue, in messages per second. */
    msgRateOut: number;
    /** Rate at which bytes are currently leaving the drain's queue, in bytes per second. */
    msgThroughputOut: number;
    /** Number of messages still queued and waiting to be shipped. */
    msgBacklog: number;
  };
}

/**
 * A log drain: a subscription that forwards the logs of an application or an add-on to an external system
 * (a syslog collector, an Elasticsearch cluster, Datadog, ...) as they are produced.
 */
export interface LogDrain extends LogDrainCommon {
  /**
   * Identifier of the application the drain is attached to. Mirrored back from the command input, the payload
   * only carries a `resourceId`.
   */
  applicationId?: string;
  /**
   * Identifier of the add-on the drain is attached to. Mirrored back from the command input, the payload only
   * carries a `resourceId`.
   */
  addonId?: string;
}

/**
 * Outcome of a server-side probe of a log drain's recipient. The API answers with a `200` whether or not the
 * recipient could be reached: `ok` tells success from failure, and `code`/`message` carry the debug detail.
 */
export interface LogDrainProbeResult {
  /** Whether the recipient answered the probe successfully. */
  ok: boolean;
  /** Short machine-readable code describing the probe outcome. */
  code: string;
  /** Human-readable explanation of the probe outcome. */
  message: string;
}

/** Status of a log drain: whether it is shipping logs, and which transition it is going through. */
export type LogDrainStatus = 'CREATED' | 'ENABLED' | 'ENABLING' | 'DISABLING' | 'DISABLED' | 'DELETED';

/** Health of the shipping worker behind a log drain. */
export type LogDrainExecutionStatus = 'RUNNING' | 'RETRYING' | 'NOT_RUNNING';

/** Which stream of logs a drain ships. */
export type LogDrainKind = 'LOG' | 'ACCESSLOG' | 'AUDITLOG';

/**
 * Where a log drain ships the logs. The `type` discriminates the protocol, and each variant carries the
 * credentials that protocol needs.
 *
 * Secrets are never read back as they were written: the API answers with a short fingerprint of the value.
 */
export type LogDrainTarget =
  | RawHttpDrainTarget
  | SyslogTcpDrainTarget
  | SyslogUdpDrainTarget
  | OvhTcpDrainTarget
  | DatadogDrainTarget
  | ElasticsearchDrainTarget
  | NewrelicDrainTarget
  | BetterStackDrainTarget;

/**
 * How the drain verifies the TLS certificate of its target: `DEFAULT` validates it, `TRUSTFUL` accepts any
 * certificate, which is what self-signed targets need.
 */
export type LogDrainTlsVerification = 'DEFAULT' | 'TRUSTFUL';

/** Ships the logs as HTTP requests to an arbitrary endpoint. */
export interface RawHttpDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'RAW_HTTP';
  /** URL the logs are POSTed to. */
  url: string;
  /** HTTP basic auth credentials to send with each request. */
  credentials?: {
    /** User name of the basic auth credentials. */
    username: string;
    /** Password of the basic auth credentials. Read back as a fingerprint, not as the value that was sent. */
    password: string;
  };
}

/** Ships the logs as RFC 5424 syslog messages over TCP. */
export interface SyslogTcpDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'SYSLOG_TCP';
  /** URL of the syslog collector, port 514 being assumed when the URL does not carry one. */
  url: string;
  /**
   * Extra RFC 5424 structured data parameters to add to every message, as a raw `key="value"` list.
   */
  rfc5424StructuredDataParameters?: string;
}

/** Ships the logs as RFC 5424 syslog messages over UDP. */
export interface SyslogUdpDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'SYSLOG_UDP';
  /** URL of the syslog collector, port 514 being assumed when the URL does not carry one. */
  url: string;
  /**
   * Extra RFC 5424 structured data parameters to add to every message, as a raw `key="value"` list.
   */
  rfc5424StructuredDataParameters?: string;
}

/** Ships the logs to OVH's Logs Data Platform, as syslog messages over TCP. */
export interface OvhTcpDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'OVH_TCP';
  /** URL of the OVH collector. */
  url: string;
  /** OVH stream token identifying which stream the messages belong to. Read back as a fingerprint. */
  token?: string;
  /**
   * Extra RFC 5424 structured data parameters to add to every message, as a raw `key="value"` list.
   */
  rfc5424StructuredDataParameters?: string;
}

/** Ships the logs to Datadog. */
export interface DatadogDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'DATADOG';
  /** Datadog intake URL, which carries the API key in its path. The key is read back as a fingerprint. */
  url: string;
}

/** Ships the logs to an Elasticsearch cluster, through its bulk API. */
export interface ElasticsearchDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'ELASTICSEARCH';
  /** URL of the Elasticsearch cluster. */
  url: string;
  /** HTTP basic auth credentials to send with each request. */
  credentials?: {
    /** User name of the basic auth credentials. */
    username: string;
    /** Password of the basic auth credentials. Read back as a fingerprint, not as the value that was sent. */
    password: string;
  };
  /**
   * Prefix of the indices the documents are written to: the drain appends the day to it, so documents land in
   * `<indexPrefix>-YYYY-MM-DD`.
   * @renamedFrom `index`
   */
  indexPrefix?: string;
  /** How the drain verifies the TLS certificate of the cluster. */
  tlsVerification?: LogDrainTlsVerification;
}

/** Ships the logs to New Relic. */
export interface NewrelicDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'NEWRELIC';
  /** New Relic log intake URL. */
  url: string;
  /** New Relic API key, sent as a bearer token. Read back as a fingerprint, not as the value that was sent. */
  apiKey: string;
}

/** Ships the logs to Better Stack. */
export interface BetterStackDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'BETTERSTACK';
  /** Better Stack ingesting URL. */
  url: string;
  /**
   * Better Stack source token, sent as a bearer token. Read back as a fingerprint, not as the value that was
   * sent.
   */
  sourceToken: string;
}
