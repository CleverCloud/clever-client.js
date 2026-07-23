/**
 * A deployment of an application: one run of the orchestrator that brings the application to a new state
 * (deploy, undeploy, scale, ...) and creates or destroys the instances backing it.
 */
export interface Deployment {
  /** Public identifier of the deployment, of the form `deployment_<uuid>`. */
  id: string;
  /** Identifier of the organisation the deployed application belongs to. */
  ownerId: string;
  /** Identifier of the deployed application. */
  applicationId: string;
  /**
   * When the deployment was queued, which is also the date of its first step.
   * @renamedFrom `startDate`
   */
  startsAt: string;
  /** Current state of the deployment, which is the state of its most recent step. */
  state: DeploymentState;
  /**
   * States the deployment went through, oldest first. Only the most recent occurrence of each state is kept,
   * so a given state never appears twice.
   */
  steps: Array<DeploymentStep>;
  /** Code the deployment ships. */
  version: {
    /** Identifier of the git commit that was deployed. Absent when the deployment does not ship a commit. */
    commitId?: string;
  };
  /** What triggered the deployment and how it was scheduled. */
  origin: {
    /** What the deployment does to the application. */
    action: DeploymentAction;
    /** Free-form reason recorded by whatever triggered the deployment. */
    cause: string;
    /** System the deployment was triggered from (git push, API call, ...). */
    source: string;
    /** Identifier of the user who triggered the deployment. */
    authorId: string;
    /** Placement constraints the orchestrator had to honour when picking hypervisors for the instances. */
    constraints: Array<string>;
    /** Scheduling priority of the deployment in the orchestrator queue. */
    priority: 'ADMIN' | 'URGENT' | 'DEFAULT';
  };
  /** Whether the application is built on a dedicated build instance rather than on its runtime instances. */
  hasDedicatedBuild: boolean;
}

/** What a deployment does to the application it targets. */
export type DeploymentAction = 'DEPLOY' | 'UNDEPLOY' | 'UPSCALE' | 'DOWNSCALE' | 'REPLACE' | 'CANCEL' | 'NONE';

/** Lifecycle state of a deployment. */
export type DeploymentState = 'QUEUED' | 'WORK_IN_PROGRESS' | 'TASK_IN_PROGRESS' | 'FAILED' | 'CANCELLED' | 'SUCCEEDED';

/** One state a deployment went through, with the moment it entered it. */
export interface DeploymentStep {
  /** State the deployment entered. */
  state: DeploymentState;
  /** When the deployment entered that state. */
  date: string;
}

/**
 * A deployment as the legacy v2 API exposes it: a flatter shape, with a per-application incremental number and
 * an author, but without the steps and placement details of the v4 shape.
 */
export interface DeploymentLegacy {
  /**
   * Public identifier of the deployment, of the form `deployment_<uuid>`.
   * @renamedFrom `uuid`
   */
  id: string;
  /** Identifier of the deployed application. Taken from the command input, the payload does not carry it. */
  applicationId: string;
  /**
   * Number of the deployment within its application, incrementing from one deployment to the next. Renamed
   * from `id`.
   */
  index: number;
  /**
   * When the deployment started.
   * @converted to an ISO date string
   */
  date: string;
  /**
   * Current state of the deployment.
   * @converted from the legacy states (`WIP`, `FAIL`, `OK`, `TASK_RUNNING`)
   */
  state: Omit<DeploymentState, 'QUEUED'>;
  /** What the deployment does to the application. */
  action: DeploymentAction;
  /** Identifier of the git commit that was deployed. */
  commit: string;
  /** Free-form reason recorded by whatever triggered the deployment. */
  cause: string;
  /** Number of instances the deployment targets. Defaults to 0 when the backend does not report it. */
  instances: number;
  /** User who triggered the deployment. */
  author: {
    /** Identifier of the user who triggered the deployment. */
    id: string;
    /** Display name of the user who triggered the deployment. */
    name: string;
  };
}
