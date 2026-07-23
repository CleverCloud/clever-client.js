export interface Deployment {
  id: string;
  ownerId: string;
  applicationId: string;
  // renamed from startDate
  startsAt: string;
  state: DeploymentState;
  steps: Array<DeploymentStep>;
  version: {
    commitId?: string;
  };
  origin: {
    action: DeploymentAction;
    cause: string;
    source: string;
    authorId: string;
    constraints: Array<string>;
    priority: 'ADMIN' | 'URGENT' | 'DEFAULT';
  };
  hasDedicatedBuild: boolean;
}

export type DeploymentAction = 'DEPLOY' | 'UNDEPLOY' | 'UPSCALE' | 'DOWNSCALE' | 'REPLACE' | 'CANCEL' | 'NONE';

export type DeploymentState = 'QUEUED' | 'WORK_IN_PROGRESS' | 'TASK_IN_PROGRESS' | 'FAILED' | 'CANCELLED' | 'SUCCEEDED';

export interface DeploymentStep {
  state: DeploymentState;
  date: string;
}

export interface DeploymentLegacy {
  // renamed from uuid
  id: string;
  // transformed: taken from the command input, the payload does not carry it
  applicationId: string;
  // renamed from id
  index: number;
  // transformed: converted to an ISO date string
  date: string;
  // transformed: converted from the legacy states (WIP, FAIL, OK, TASK_RUNNING)
  state: Omit<DeploymentState, 'QUEUED'>;
  action: DeploymentAction;
  commit: string;
  cause: string;
  // transformed: defaults to 0 when null
  instances: number;
  author: { id: string; name: string };
}
