/**
 * @import { LogDrain, LogDrainTarget } from './log-drain.types.js'
 */

import { normalizeDate, omit } from '../../../../lib/utils.js';

/**
 * @param {any} response
 * @return {LogDrain}
 */
export function transformLogDrain(response) {
  return {
    id: response.id,
    applicationId: response.appId,
    createdAt: normalizeDate(response.createdAt.replace('[UTC]', '')),
    lastEdit: normalizeDate(response.lastEdit.replace('[UTC]', '')),
    state: response.state,
    token: response.token,
    updatedBy: response.updatedBy,
    target: transformLogDrainTarget(response.target),
  };
}

/**
 * @param {any} response
 * @return {LogDrainTarget}
 */
export function transformLogDrainTarget(response) {
  // @ts-ignore
  return {
    ...omit(response, 'type'),
    type: response.drainType,
  };
}
