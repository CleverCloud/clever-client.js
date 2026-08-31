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
 * What every probe result carries, whichever transport the probe exercised.
 */
interface LogDrainProbeResultCommon {
  /** Whether the recipient answered the probe successfully. */
  ok: boolean;
  /** Short machine-readable code describing the probe outcome. */
  code: string;
  /** Human-readable explanation of the probe outcome. */
  message: string;
  /**
   * How long the probe took, as an ISO 8601 duration.
   * @renamedFrom `durationMs`
   * @converted from a number of milliseconds to an ISO 8601 duration
   */
  duration?: string;
}

/**
 * Outcome of a server-side probe of a log drain's recipient. The API answers with a `200` whether or not the
 * recipient could be reached: `ok` tells success from failure, and `code`/`message` carry the debug detail.
 *
 * The `type` discriminates the transport the probe exercised, and each variant carries the detail block that
 * transport produces.
 */
export type LogDrainProbeResult =
  | HttpLogDrainProbeResult
  | TcpLogDrainProbeResult
  | UdpLogDrainProbeResult
  | AbortedLogDrainProbeResult;

/** Transport a log drain probe exercises, decided by the kind of target the drain ships to. */
export type LogDrainProbeType = 'HTTP' | 'TCP' | 'UDP';

/** Outcome of a probe that sent an HTTP request to the recipient. */
export interface HttpLogDrainProbeResult extends LogDrainProbeResultCommon {
  /** Discriminates the transport the probe exercised. */
  type: 'HTTP';
  /** What the probe sent, and what came back. */
  http: LogDrainProbeHttpDetail;
}

/** Outcome of a probe that opened a TCP connection to the recipient. */
export interface TcpLogDrainProbeResult extends LogDrainProbeResultCommon {
  /** Discriminates the transport the probe exercised. */
  type: 'TCP';
  /** Outcome of the connection attempt. */
  tcp: LogDrainProbeTcpDetail;
}

/**
 * Outcome of a probe of a UDP recipient, which is never probed at all: UDP delivery carries no
 * acknowledgement, so there is nothing to check and no detail to report, and `ok` is always `true`.
 */
export interface UdpLogDrainProbeResult extends LogDrainProbeResultCommon {
  /** Discriminates the transport the probe exercised. */
  type: 'UDP';
}

/**
 * Outcome of a probe that ended without any transport reporting back, which today means the overall probe
 * timeout fired. It carries no detail block, leaving `code` as the only account of what happened.
 */
export interface AbortedLogDrainProbeResult extends LogDrainProbeResultCommon {
  /** Absent, because the probe exercised no transport. */
  type?: undefined;
}

/** The HTTP exchange a probe went through with the recipient. */
export interface LogDrainProbeHttpDetail {
  /** The request the probe sent, standing in for a real delivery. */
  request: LogDrainProbeHttpRequest;
  /**
   * What the recipient answered. Absent when no HTTP response came back at all (a DNS, a connection or a TLS
   * failure), leaving `code` as the only account of what went wrong.
   */
  response?: LogDrainProbeHttpResponse;
}

/** The request a probe sent to the recipient. */
export interface LogDrainProbeHttpRequest {
  /** HTTP method of the request. */
  method: string;
  /** URL the request was sent to, with the secrets some target URLs carry masked. */
  url: string;
  /** Headers of the request, keyed by header name. Credentials are redacted. */
  headers: Record<string, string>;
  /**
   * Body of the request, cut off past 2048 characters with a `…[truncated]` marker. Absent when the request
   * carried no body.
   */
  body?: string;
}

/** The response the recipient answered a probe with. */
export interface LogDrainProbeHttpResponse {
  /** HTTP status code of the response. */
  statusCode: number;
  /**
   * Headers of the response, keyed by header name, each holding every occurrence of that header in the order
   * it came in. Credentials are redacted.
   */
  headers: Record<string, Array<string>>;
  /**
   * Body of the response, cut off past 2048 characters with a `…[truncated]` marker. Absent when the response
   * carried no body, or when it was too large to be read.
   */
  body?: string;
}

/** Outcome of the connection a probe opened to the recipient. */
export interface LogDrainProbeTcpDetail {
  /**
   * Whether the connection was established.
   * @renamedFrom `connected`
   */
  wasConnected: boolean;
  /** Host the probe connected to. */
  host: string;
  /** Port the probe connected to. */
  port: number;
}

/** Status of a log drain: whether it is shipping logs, and which transition it is going through. */
export type LogDrainStatus = 'CREATED' | 'ENABLED' | 'ENABLING' | 'DISABLING' | 'DISABLED' | 'DELETED';

/** Health of the shipping worker behind a log drain. */
export type LogDrainExecutionStatus = 'RUNNING' | 'RETRYING' | 'NOT_RUNNING';

/** Which stream of logs a drain ships. */
export type LogDrainKind = 'LOG' | 'ACCESSLOG' | 'AUDITLOG';

/**
 * Which stream of logs a drain attached to an application or an add-on ships. Audit logs are missing because
 * they record what the organisation's members did, and belong to no application nor add-on.
 */
export type ApplicationOrAddonLogDrainKind = 'LOG' | 'ACCESSLOG';

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
  | BetterStackDrainTarget
  | SplunkDrainTarget;

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
  /**
   * URL of the bulk endpoint of the Elasticsearch cluster, whose path has to end in `/_bulk`.
   */
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
  indexPrefix: string;
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

/** Ships the logs to Splunk, through its HTTP Event Collector. */
export interface SplunkDrainTarget {
  /** Discriminates the protocol of the target. */
  type: 'SPLUNK';
  /** URL of the HTTP Event Collector endpoint, e.g. `https://<host>:8088/services/collector/event`. */
  url: string;
  /**
   * HTTP Event Collector token the drain authenticates with.
   */
  token: string;
  /**
   * Index the events are written to, used as is.
   * Absent to let the index configured on the HTTP Event Collector token apply.
   */
  index?: string;
  /**
   * Sourcetype applied to the forwarded events. Absent to let the sourcetype configured on the HTTP Event
   * Collector token apply.
   * @renamedFrom `sourcetype`
   */
  sourceType?: string;
  /** How the drain verifies the TLS certificate of the collector. */
  tlsVerification?: LogDrainTlsVerification;
}
