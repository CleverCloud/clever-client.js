/**
 * @import { LogDrain, LogDrainTarget } from './log-drain.types.js'
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {LogDrain}
 */
export function transformLogDrain(payload) {
  return {
    id: payload.id,
    applicationId: payload.resourceId,
    createdAt: normalizeDate(payload.status.date),
    lastEdit: normalizeDate(payload.status.date),
    state: payload.status.status,
    updatedBy: payload.status.authorId,
    kind: payload.kind,
    target: transformLogDrainTarget(payload.recipient),
  };
}

/**
 * @param {any} payload
 * @returns {LogDrainTarget}
 */
export function transformLogDrainTarget(payload) {
  // payload is the recipient object from the v4 API response
  const type = payload.type;

  switch (type) {
    case 'RAW_HTTP': {
      /** @type {any} */
      const target = {
        type: 'HTTP',
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
      /** @type {any} */
      const target = {
        type: 'TCPSyslog',
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.structuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'SYSLOG_UDP': {
      /** @type {any} */
      const target = {
        type: 'UDPSyslog',
        url: payload.url,
      };
      if (payload.rfc5424StructuredDataParameters) {
        target.structuredDataParameters = payload.rfc5424StructuredDataParameters;
      }
      return target;
    }
    case 'DATADOG':
      return {
        type: 'DatadogHTTP',
        url: payload.url,
      };
    case 'ELASTICSEARCH': {
      /** @type {any} */
      const target = {
        type: 'ElasticSearch',
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
        type: 'NewRelicHTTP',
        url: payload.url,
        apiKey: payload.apiKey,
      };
  }
}
