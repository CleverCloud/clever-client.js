/**
 * One line written by an application instance, as collected from its syslog stream: the build and runtime
 * output of the application, plus the output of the platform services running alongside it.
 */
export interface ApplicationRuntimeLog {
  /** Identifier of the log line, built from its position in the underlying message log (`ledger:entry:partition`). */
  id: string;
  /** Identifier of the application that emitted the line. */
  applicationId: string;
  /** Identifier of the git commit the emitting instance runs. */
  commitId: string;
  /** Identifier of the deployment that created the emitting instance. */
  deploymentId: string;
  /** Identifier of the instance that emitted the line. */
  instanceId: string;
  /**
   * When the line was emitted.
   * @converted to an ISO date string
   */
  date: string;
  /** Name of the zone the emitting instance runs in. */
  zone: string;
  /** Process id of the emitting process on the instance. */
  pid: number;
  /** Syslog facility the line was emitted on. */
  facility: number;
  /** Syslog severity of the line, derived from its priority (`emerg`, `alert`, ..., `debug`). */
  severity: string;
  /** Raw syslog priority of the line. */
  priority: number;
  /** Syslog protocol version the line was emitted with. */
  version: string;
  /** Systemd unit that emitted the line, without its `.service` suffix. */
  service: string;
  /** The log line itself. */
  message: string;
}

/**
 * One line written by an add-on instance, as collected from its syslog stream: the runtime output of the
 * managed service backing the add-on.
 */
export interface AddonRuntimeLog {
  /** Identifier of the log line, built from its position in the underlying message log (`ledger:entry:partition`). */
  id: string;
  /**
   * Identifier of the add-on that emitted the line.
   * @renamedFrom `resourceId`
   */
  addonId: string;
  /** Host name of the machine that emitted the line. */
  hostname: string;
  /** Identifier of the add-on instance that emitted the line. */
  instanceId: string;
  /**
   * When the line was emitted.
   * @converted to an ISO date string
   */
  date: string;
  /** Name of the zone the emitting instance runs in. */
  zone: string;
  /** Process id of the emitting process on the instance. */
  pid: number;
  /** Syslog facility the line was emitted on, by name (`kern`, `daemon`, `local0`, ...). */
  facility: string;
  /** Syslog severity of the line, derived from its priority (`emerg`, `alert`, ..., `debug`). */
  severity: string;
  /** Systemd unit that emitted the line, without its `.service` suffix. */
  service: string;
  /** The log line itself. */
  message: string;
}

/**
 * One request served on behalf of an application by the platform's load balancers. Only HTTP requests are
 * exposed for now; TCP and SSH access logs are dropped.
 */
export type ApplicationAccessLog = ApplicationAccessLogHttp;

/**
 * What every access log carries, whatever the protocol of the request. The protocol-specific part lives in
 * `detail`.
 */
export interface ApplicationAccessLogBase<T> {
  /** Identifier of the access log, built from its position in the underlying message log (`ledger:entry:partition`). */
  id: string;
  /**
   * When the request was served.
   * @converted to an ISO date string
   */
  date: string;
  /** Identifier of the application the request was routed to. */
  applicationId: string;
  /** Identifier of the instance that served the request. */
  instanceId: string;
  /** Identifier the load balancer assigned to the request, which correlates it across logs. */
  requestId: string;
  /** Number of bytes the load balancer received from the client. */
  bytesIn: number;
  /** Number of bytes the load balancer sent back to the client. */
  bytesOut: number;
  /** Where the request came from, with the geolocation of its IP address. */
  source: AccessLogPeer;
  /** Which load balancer endpoint the request landed on. */
  destination: AccessLogPeer;
  /** TLS version the request was served over. Absent when the request was not served over TLS. */
  tls?: string;
  /** Name of the zone the request was served in. */
  zone: string;
  /** Protocol-specific details of the request. */
  detail: T;
}

/**
 * One end of a logged request: an IP address and port, plus what is known of its physical location.
 */
export interface AccessLogPeer {
  /** City the IP address is geolocated to. */
  city: string;
  /** Two-letter country code the IP address is geolocated to, lowercase (`fr`, `us`, ...). */
  countryCode: string;
  /** Coordinates the IP address is geolocated to. */
  geoLocation: {
    /** Latitude of the geolocated IP address. */
    latitude: number;
    /** Longitude of the geolocated IP address. */
    longitude: number;
  };
  /** IP address of the peer. */
  ip: string;
  /** Port of the peer. */
  port: number;
}

/**
 * An access log for an HTTP request.
 */
export interface ApplicationAccessLogHttp extends ApplicationAccessLogBase<ApplicationAccessLogHttpDetail> {
  /** Discriminates the protocol of the logged request. */
  type: 'http';
}

/**
 * The HTTP-specific part of an access log: what the client asked for, and what the application answered.
 */
export interface ApplicationAccessLogHttpDetail {
  /** What the client asked for. */
  request: {
    /** Host name the request was addressed to. */
    host: string;
    /** HTTP method of the request. */
    method: string;
    /** Path of the request, without its query string. */
    path: string;
    /** Scheme the request came in on (`http` or `https`). */
    scheme: string;
  };
  /** What the application answered. */
  response: {
    /** HTTP status code the application answered with. */
    statusCode: number;
    /** How long the application took to answer, in milliseconds. */
    time: number;
  };
}
