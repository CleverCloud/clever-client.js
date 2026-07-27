import { normalizeDate } from '../../../../lib/utils.js';
import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type {
  ElasticsearchDrainTarget,
  LogDrain,
  LogDrainExecutionStatus,
  LogDrainKind,
  LogDrainStatus,
  LogDrainTarget,
  LogDrainTlsVerification,
  OvhTcpDrainTarget,
  RawHttpDrainTarget,
  SyslogTcpDrainTarget,
  SyslogUdpDrainTarget,
} from './log-drain.types.js';

interface ApiLogDrainPayload {
  id: string;
  resourceId: string;
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
  type: 'RAW_HTTP' | 'SYSLOG_TCP' | 'SYSLOG_UDP' | 'OVH_TCP' | 'DATADOG' | 'ELASTICSEARCH' | 'NEWRELIC' | 'BETTERSTACK';
  url: string;
  username?: string;
  password?: string;
  apiKey?: string;
  index?: string;
  rfc5424StructuredDataParameters?: string;
  token?: string;
  sourceToken?: string;
  tlsVerification?: LogDrainTlsVerification;
}

/**
 * Transform API v4 log drain payload to client format.
 * `ref` mirrors back whichever of `applicationId`/`addonId` the caller used to identify the drain.
 */
export function transformLogDrain(payload: ApiLogDrainPayload, ref: ApplicationOrAddonId): LogDrain {
  const common = {
    id: payload.id,
    updatedAt: normalizeDate(payload.status.date)!,
    status: payload.status.status,
    updatedBy: payload.status.authorId,
    errorReason: payload.status.errorReason,
    kind: payload.kind!,
    target: transformLogDrainTarget(payload.recipient),
    execution: {
      status: payload.execution.status,
      lastError: payload.execution.lastError,
      attempt: payload.execution.attempt,
      maxAttempt: payload.execution.maxAttempt,
      lastAttemptAt: normalizeDate(payload.execution.lastAttemptAt) ?? undefined,
      nextAttemptAt: normalizeDate(payload.execution.nextAttemptAt) ?? undefined,
      retryingSince: normalizeDate(payload.execution.retryingSince) ?? undefined,
    },
    backlog: payload.backlog,
  };

  return 'applicationId' in ref ? { ...common, applicationId: ref.applicationId } : { ...common, addonId: ref.addonId };
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
    if (target.indexPrefix != null) {
      body.recipient.index = target.indexPrefix;
    }
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
      };
      if (payload.username) {
        target.credentials = {
          username: payload.username,
          password: payload.password!,
        };
      }
      if (payload.index) {
        target.indexPrefix = payload.index;
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
  }
}
