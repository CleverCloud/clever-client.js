/**
 * @import { LogDrain, LogDrainTarget } from './log-drain.types.js'
 */

import { normalizeDate, omit } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @return {LogDrain}
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
 * @return {LogDrainTarget}
 */
export function transformLogDrainTarget(payload) {
  // @ts-ignore
  return {
    ...omit(payload, 'drainType'),
    type: payload.drainType,
  };
}
