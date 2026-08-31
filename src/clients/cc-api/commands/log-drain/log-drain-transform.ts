import { normalizeDate } from '../../../../lib/utils.js';
import { normalizeDuration } from '../../../../utils/duration-utils.js';
import type {
  ApplicationOrAddonLogDrainKind,
  AuditLogDrain,
  ElasticsearchDrainTarget,
  LogDrain,
  LogDrainExecutionStatus,
  LogDrainKind,
  LogDrainProbeHttpDetail,
  LogDrainProbeResult,
  LogDrainProbeType,
  LogDrainStatus,
  LogDrainTarget,
  LogDrainTlsVerification,
  OvhTcpDrainTarget,
  RawHttpDrainTarget,
  SplunkDrainTarget,
  SyslogTcpDrainTarget,
  SyslogUdpDrainTarget,
} from './log-drain.types.js';

interface ApiLogDrainPayload {
  id: string;
  /** Left out for an AUDITLOG drain, which is attached to the organisation rather than to a resource. */
  resourceId?: string | null;
  status: { date: string; status: LogDrainStatus; authorId?: string; errorReason?: string };
  kind?: LogDrainKind;
  recipient: ApiRecipientPayload;
  execution: {
    status: LogDrainExecutionStatus;
    lastError?: string;
    attempt?: number;
    maxAttempt?: number;
    lastAttemptAt?: string;
    nextAttemptAt?: string;
    retryingSince?: string;
  };
  backlog?: { msgRateOut: number; msgThroughputOut: number; msgBacklog: number };
}

interface ApiRecipientPayload {
  type:
    | 'RAW_HTTP'
    | 'SYSLOG_TCP'
    | 'SYSLOG_UDP'
    | 'OVH_TCP'
    | 'DATADOG'
    | 'ELASTICSEARCH'
    | 'NEWRELIC'
    | 'BETTERSTACK'
    | 'SPLUNK';
  url: string;
  username?: string;
  password?: string;
  apiKey?: string;
  index?: string;
  rfc5424StructuredDataParameters?: string;
  token?: string;
  sourceToken?: string;
  sourcetype?: string;
  tlsVerification?: LogDrainTlsVerification;
}

interface ApiProbeResultPayload {
  ok: boolean;
  code: string;
  message: string;
  type?: LogDrainProbeType | null;
  durationMs?: number | null;
  http?: ApiProbeHttpDetailPayload | null;
  tcp?: ApiProbeTcpDetailPayload | null;
}

interface ApiProbeHttpDetailPayload {
  request: { method: string; url: string; headers: Record<string, string>; body?: string | null };
  response?: {
    statusCode: number;
    headers: Record<string, Array<string>>;
    body?: string | null;
  } | null;
}

interface ApiProbeTcpDetailPayload {
  connected: boolean;
  host: string;
  port: number;
}

/**
 * Transform the fields an API v4 log drain payload carries whichever stream the drain ships.
 */
function transformLogDrainCommon(payload: ApiLogDrainPayload): Omit<LogDrain, 'kind' | 'resourceId'> {
  return {
    id: payload.id,
    updatedAt: normalizeDate(payload.status.date)!,
    status: payload.status.status,
    updatedBy: payload.status.authorId ?? undefined,
    errorReason: payload.status.errorReason ?? undefined,
    target: transformLogDrainTarget(payload.recipient),
    execution: {
      status: payload.execution.status,
      lastError: payload.execution.lastError ?? undefined,
      attempt: payload.execution.attempt ?? undefined,
      maxAttempt: payload.execution.maxAttempt ?? undefined,
      lastAttemptAt: normalizeDate(payload.execution.lastAttemptAt),
      nextAttemptAt: normalizeDate(payload.execution.nextAttemptAt),
      retryingSince: normalizeDate(payload.execution.retryingSince),
    },
    backlog: payload.backlog ?? undefined,
  };
}

/**
 * Transform API v4 log drain payload to client format.
 * The drain is attached to an application or an add-on, so the payload always names the resource it ships the
 * logs of.
 */
export function transformLogDrain(payload: ApiLogDrainPayload): LogDrain {
  return {
    ...transformLogDrainCommon(payload),
    kind: payload.kind as ApplicationOrAddonLogDrainKind,
    resourceId: payload.resourceId!,
  };
}

/**
 * Transform API v4 audit log drain payload to client format.
 * An audit log drain is attached to the organisation itself, so the payload names no resource.
 */
export function transformAuditLogDrain(payload: ApiLogDrainPayload): AuditLogDrain {
  return { ...transformLogDrainCommon(payload), kind: 'AUDITLOG' };
}

/**
 * Build the API v4 request body to create a log drain
 */
export function buildLogDrainCreatePayload(
  kind: LogDrainKind,
  target: LogDrainTarget,
): { kind: LogDrainKind; recipient: ApiRecipientPayload } {
  const body: { kind: LogDrainKind; recipient: ApiRecipientPayload } = {
    kind,
    recipient: {
      type: target.type,
      url: target.url,
    },
  };

  // RAW_HTTP and ELASTICSEARCH: credentials
  if (target.type === 'RAW_HTTP' || target.type === 'ELASTICSEARCH') {
    if (target.credentials != null) {
      body.recipient.username = target.credentials.username;
      body.recipient.password = target.credentials.password;
    }
  }

  // ELASTICSEARCH: index (renamed from indexPrefix) and tlsVerification
  if (target.type === 'ELASTICSEARCH') {
    body.recipient.index = target.indexPrefix;
    if (target.tlsVerification != null) {
      body.recipient.tlsVerification = target.tlsVerification;
    }
  }

  // NEWRELIC: apiKey
  if (target.type === 'NEWRELIC') {
    body.recipient.apiKey = target.apiKey;
  }

  // BETTERSTACK: sourceToken
  if (target.type === 'BETTERSTACK') {
    body.recipient.sourceToken = target.sourceToken;
  }

  // OVH_TCP: token
  if (target.type === 'OVH_TCP') {
    if (target.token != null) {
      body.recipient.token = target.token;
    }
  }

  // SPLUNK: token, index, sourcetype and tlsVerification
  if (target.type === 'SPLUNK') {
    body.recipient.token = target.token;
    if (target.index != null) {
      body.recipient.index = target.index;
    }
    if (target.sourceType != null) {
      body.recipient.sourcetype = target.sourceType;
    }
    if (target.tlsVerification != null) {
      body.recipient.tlsVerification = target.tlsVerification;
    }
  }

  // Syslog/OVH_TCP: RFC 5424 structured data parameters
  if (target.type === 'SYSLOG_TCP' || target.type === 'SYSLOG_UDP' || target.type === 'OVH_TCP') {
    if (target.rfc5424StructuredDataParameters != null) {
      body.recipient.rfc5424StructuredDataParameters = target.rfc5424StructuredDataParameters;
    }
  }

  return body;
}

/**
 * Transform API v4 recipient payload to client drain target format
 */
export function transformLogDrainTarget(payload: ApiRecipientPayload): LogDrainTarget {
  switch (payload.type) {
    case 'RAW_HTTP': {
      const target: RawHttpDrainTarget = {
        type: 'RAW_HTTP',
        url: payload.url,
      };
      if (payload.username) {
        target.credentials = {
          username: payload.username,
          password: payload.password!,
        };
      }
      return target;
    }
    case 'SYSLOG_TCP':
    case 'SYSLOG_UDP': {
      const target: SyslogTcpDrainTarget | SyslogUdpDrainTarget = {
        type: payload.type,
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.rfc5424StructuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'OVH_TCP': {
      const target: OvhTcpDrainTarget = {
        type: 'OVH_TCP',
        url: payload.url,
      };
      if (payload.token) {
        target.token = payload.token;
      }
      if (payload.rfc5424StructuredDataParameters) {
        target.rfc5424StructuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'DATADOG':
      return {
        type: 'DATADOG',
        url: payload.url,
      };
    case 'ELASTICSEARCH': {
      const target: ElasticsearchDrainTarget = {
        type: 'ELASTICSEARCH',
        url: payload.url,
        indexPrefix: payload.index!,
      };
      if (payload.username) {
        target.credentials = {
          username: payload.username,
          password: payload.password!,
        };
      }
      if (payload.tlsVerification) {
        target.tlsVerification = payload.tlsVerification;
      }
      return target;
    }
    case 'NEWRELIC':
      return {
        type: 'NEWRELIC',
        url: payload.url,
        apiKey: payload.apiKey!,
      };
    case 'BETTERSTACK':
      return {
        type: 'BETTERSTACK',
        url: payload.url,
        sourceToken: payload.sourceToken!,
      };
    case 'SPLUNK': {
      const target: SplunkDrainTarget = {
        type: 'SPLUNK',
        url: payload.url,
        token: payload.token!,
      };
      if (payload.index) {
        target.index = payload.index;
      }
      if (payload.sourcetype) {
        target.sourceType = payload.sourcetype;
      }
      if (payload.tlsVerification) {
        target.tlsVerification = payload.tlsVerification;
      }
      return target;
    }
  }
}

/**
 * Transform API v4 drain probe payload to client format.
 * The variant is picked from the transport the probe reports, and a probe that reached none of them, which the
 * API answers by leaving the field out, becomes the transport-less variant.
 */
export function transformLogDrainProbeResult(payload: ApiProbeResultPayload): LogDrainProbeResult {
  const common = {
    ok: payload.ok,
    code: payload.code,
    message: payload.message,
    duration: normalizeDuration(payload.durationMs),
  };

  // the API attaches the transport and its detail block in one move, so a block is guaranteed to be there
  // whenever the transport it belongs to is the one reported
  switch (payload.type) {
    case 'HTTP':
      return { ...common, type: 'HTTP', http: transformLogDrainProbeHttpDetail(payload.http!) };
    case 'TCP':
      return {
        ...common,
        type: 'TCP',
        tcp: { wasConnected: payload.tcp!.connected, host: payload.tcp!.host, port: payload.tcp!.port },
      };
    case 'UDP':
      return { ...common, type: 'UDP' };
    default:
      return common;
  }
}

/**
 * Transform API v4 drain probe HTTP detail payload to client format
 */
function transformLogDrainProbeHttpDetail(payload: ApiProbeHttpDetailPayload): LogDrainProbeHttpDetail {
  const response = payload.response;

  return {
    request: {
      method: payload.request.method,
      url: payload.request.url,
      headers: { ...payload.request.headers },
      body: payload.request.body ?? undefined,
    },
    response:
      response != null
        ? {
            statusCode: response.statusCode,
            headers: Object.fromEntries(Object.entries(response.headers).map(([name, values]) => [name, [...values]])),
            body: response.body ?? undefined,
          }
        : undefined,
  };
}
