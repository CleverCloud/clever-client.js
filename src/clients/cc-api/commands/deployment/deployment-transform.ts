import { normalizeDate } from '../../../../lib/utils.js';
import type { Deployment, DeploymentLegacy, DeploymentState } from './deployment.types.js';

const DEPLOYMENT_STATE_CONVERT_MAP: Record<string, Omit<DeploymentState, 'QUEUED'>> = {
  TASK_RUNNING: 'TASK_IN_PROGRESS',
  WIP: 'WORK_IN_PROGRESS',
  FAIL: 'FAILED',
  CANCELLED: 'CANCELLED',
  OK: 'SUCCEEDED',
};

export function transformDeployment(payload: any): Deployment {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    applicationId: payload.applicationId,
    startsAt: payload.startDate,
    state: payload.state,
    steps: payload.steps,
    version: payload.version,
    origin: payload.origin,
    hasDedicatedBuild: payload.hasDedicatedBuild,
  };
}

export function transformDeploymentLegacy(payload: any, applicationId: string): DeploymentLegacy {
  return {
    id: payload.uuid,
    applicationId,
    index: payload.id,
    date: normalizeDate(payload.date)!,
    state: DEPLOYMENT_STATE_CONVERT_MAP[payload.state],
    action: payload.action,
    commit: payload.commit,
    cause: payload.cause,
    instances: payload.instances ?? 0,
    author: payload.author,
  };
}
