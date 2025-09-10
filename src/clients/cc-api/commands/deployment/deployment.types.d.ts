export interface Deployment {
  id: string;
  ownerId: string;
  applicationId: string;
  startDate: string;
  state: DeploymentState;
  steps: Array<DeploymentStep>;
  version: {
    commitId: string;
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
  id: string;
  applicationId: string;
  index: number;
  date: string;
  state: Omit<DeploymentState, 'QUEUED'>;
  action: DeploymentAction;
  commit: string;
  cause: string;
  instances: number;
  author: { id: string; name: string };
}
