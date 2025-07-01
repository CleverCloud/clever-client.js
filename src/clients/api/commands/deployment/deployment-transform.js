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
 * @param {any} deployment
 * @param {string} applicationId
 * @returns {DeploymentLegacy}
 */
export function transformDeploymentLegacy(deployment, applicationId) {
  return {
    id: deployment.uuid,
    applicationId,
    index: deployment.id,
    date: normalizeDate(deployment.date),
    state: DEPLOYMENT_STATE_CONVERT_MAP[deployment.state],
    action: deployment.action,
    commit: deployment.commit,
    cause: deployment.cause,
    instances: deployment.instances ?? 0,
    author: deployment.author,
  };
}
