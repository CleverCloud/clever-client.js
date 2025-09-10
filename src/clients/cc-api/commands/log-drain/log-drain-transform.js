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
    applicationId: payload.appId,
    createdAt: normalizeDate(payload.createdAt),
    lastEdit: normalizeDate(payload.lastEdit),
    state: payload.state,
    token: payload.token,
    updatedBy: payload.updatedBy,
    target: transformLogDrainTarget(payload.target),
  };
}

/**
 * @param {any} payload
 * @returns {LogDrainTarget}
 */
export function transformLogDrainTarget(payload) {
  const type = payload.drainType;

  switch (type) {
    case 'HTTP':
      return {
        type: 'HTTP',
        url: payload.url,
        credentials: payload.credentials,
      };
    case 'TCPSyslog':
      return {
        type: 'TCPSyslog',
        url: payload.url,
        structuredDataParameters: payload.structuredDataParameters,
      };
    case 'UDPSyslog':
      return {
        type: 'UDPSyslog',
        url: payload.url,
        structuredDataParameters: payload.structuredDataParameters,
      };
    case 'DatadogHTTP':
      return {
        type: 'DatadogHTTP',
        url: payload.url,
      };
    case 'ElasticSearch':
      return {
        type: 'ElasticSearch',
        url: payload.url,
        credentials: payload.credentials,
        indexPrefix: payload.indexPrefix,
      };
    case 'NewRelicHTTP':
      return {
        type: 'NewRelicHTTP',
        url: payload.url,
        apiKey: payload.apiKey,
      };
  }
}
