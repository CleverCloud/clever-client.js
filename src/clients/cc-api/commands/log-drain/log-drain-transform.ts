import { normalizeDate } from '../../../../lib/utils.js';
import type {
  ElasticsearchDrainTarget,
  LogDrain,
  LogDrainExecutionStatus,
  LogDrainKind,
  LogDrainStatus,
  LogDrainTarget,
  RawHttpDrainTarget,
  SyslogTcpDrainTarget,
  SyslogUdpDrainTarget,
} from './log-drain.types.js';

interface ApiLogDrainPayload {
  id: string;
  resourceId: string;
  status: { date: string; status: LogDrainStatus; authorId?: string };
  kind?: LogDrainKind;
  recipient: ApiRecipientPayload;
  execution: { status: LogDrainExecutionStatus; lastError: string };
  backlog: { msgRateOut: number; msgBacklog: number };
}

interface ApiRecipientPayload {
  type: 'RAW_HTTP' | 'SYSLOG_TCP' | 'SYSLOG_UDP' | 'DATADOG' | 'ELASTICSEARCH' | 'NEWRELIC';
  url: string;
  username?: string;
  password?: string;
  apiKey?: string;
  index?: string;
  rfc5424StructuredDataParameters?: string;
}

/**
 * Transform API v4 log drain payload to client format
 */
export function transformLogDrain(payload: ApiLogDrainPayload): LogDrain {
  return {
    id: payload.id,
    applicationId: payload.resourceId,
    // status.date is the date when the drain's current status was set (changes when status changes)
    updatedAt: normalizeDate(payload.status.date),
    status: payload.status.status,
    updatedBy: payload.status.authorId,
    kind: payload.kind,
    target: transformLogDrainTarget(payload.recipient),
    execution: {
      ...payload.execution,
    },
    backlog: payload.backlog,
  };
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
          password: payload.password,
        };
      }
      return target;
    }
    case 'SYSLOG_TCP': {
      const target: SyslogTcpDrainTarget = {
        type: 'SYSLOG_TCP',
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.structuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'SYSLOG_UDP': {
      const target: SyslogUdpDrainTarget = {
        type: 'SYSLOG_UDP',
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.structuredDataParameters = payload.rfc5424StructuredDataParameters;
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
          password: payload.password,
        };
      }
      if (payload.index) {
        target.indexPrefix = payload.index;
      }
      return target;
    }
    case 'NEWRELIC':
      return {
        type: 'NEWRELIC',
        url: payload.url,
        apiKey: payload.apiKey,
      };
  }
}
