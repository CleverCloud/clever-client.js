import { normalizeDate } from '../../../../lib/utils.js';
import type { Deployment, DeploymentLegacy, DeploymentState, DeploymentStep } from './deployment.types.js';

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
    startsAt: normalizeDate(payload.startDate)!,
    state: payload.state,
    steps: payload.steps.map(transformDeploymentStep),
    version: {
      commitId: payload.version.commitId ?? undefined,
      previousCommitId: payload.version.previousCommitId ?? undefined,
    },
    origin: {
      action: payload.origin.action,
      cause: payload.origin.cause ?? undefined,
      source: payload.origin.source,
      authorId: payload.origin.authorId ?? undefined,
      constraints: payload.origin.constraints,
      priority: payload.origin.priority,
    },
    hasDedicatedBuild: payload.hasDedicatedBuild,
  };
}

function transformDeploymentStep(payload: any): DeploymentStep {
  return {
    state: payload.state,
    date: normalizeDate(payload.date)!,
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
    commit: payload.commit ?? undefined,
    cause: payload.cause ?? undefined,
    instances: payload.instances ?? 0,
    author: {
      id: payload.author.id ?? undefined,
      name: payload.author.name ?? undefined,
    },
  };
}
