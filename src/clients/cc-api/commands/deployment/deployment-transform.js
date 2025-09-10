/**
 * @import { DeploymentLegacy, DeploymentState } from './deployment.types.js';
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @type {Record<string, Omit<DeploymentState, 'QUEUED'>>}
 */
const DEPLOYMENT_STATE_CONVERT_MAP = {
  TASK_RUNNING: 'TASK_IN_PROGRESS',
  WIP: 'WORK_IN_PROGRESS',
  FAIL: 'FAILED',
  CANCELLED: 'CANCELLED',
  OK: 'SUCCEEDED',
};

/**
 *
 * @param {any} payload
 * @param {string} applicationId
 * @returns {DeploymentLegacy}
 */
export function transformDeploymentLegacy(payload, applicationId) {
  return {
    id: payload.uuid,
    applicationId,
    index: payload.id,
    date: normalizeDate(payload.date),
    state: DEPLOYMENT_STATE_CONVERT_MAP[payload.state],
    action: payload.action,
    commit: payload.commit,
    cause: payload.cause,
    instances: payload.instances ?? 0,
    author: payload.author,
  };
}
