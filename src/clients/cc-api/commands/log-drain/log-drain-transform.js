/**
 * @import { LogDrain, LogDrainTarget, LogDrainStatus, LogDrainKind, LogDrainExecutionStatus, RawHttpDrainTarget, SyslogTcpDrainTarget, SyslogUdpDrainTarget, ElasticsearchDrainTarget } from './log-drain.types.js'
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @typedef ApiLogDrainPayload
 * @property {string} id
 * @property {string} resourceId
 * @property {{date: string, status: LogDrainStatus, authorId?: string}} status
 * @property {LogDrainKind} [kind]
 * @property {ApiRecipientPayload} recipient
 * @property {{status: LogDrainExecutionStatus, lastError: string}} execution
 * @property {{msgRateOut: number, msgBacklog: number}} backlog
 */

/**
 * @typedef ApiRecipientPayload
 * @property {'RAW_HTTP' | 'SYSLOG_TCP' | 'SYSLOG_UDP' | 'DATADOG' | 'ELASTICSEARCH' | 'NEWRELIC'} type
 * @property {string} url
 * @property {string} [username]
 * @property {string} [password]
 * @property {string} [apiKey]
 * @property {string} [index]
 * @property {string} [rfc5424StructuredDataParameters]
 */

/**
 * Transform API v4 log drain payload to client format
 * @param {ApiLogDrainPayload} payload - API v4 drain response
 * @returns {LogDrain}
 */
export function transformLogDrain(payload) {
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
 * @param {ApiRecipientPayload} payload - API v4 recipient object
 * @returns {LogDrainTarget}
 */
export function transformLogDrainTarget(payload) {
  switch (payload.type) {
    case 'RAW_HTTP': {
      /** @type {RawHttpDrainTarget} */
      const target = {
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
      /** @type {SyslogTcpDrainTarget} */
      const target = {
        type: 'SYSLOG_TCP',
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.structuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'SYSLOG_UDP': {
      /** @type {SyslogUdpDrainTarget} */
      const target = {
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
      /** @type {ElasticsearchDrainTarget} */
      const target = {
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
