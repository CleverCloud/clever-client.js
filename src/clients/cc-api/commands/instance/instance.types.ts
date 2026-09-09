/**
 * A virtual machine backing an application: one of the instances a deployment creates to run the application,
 * or to build it when the application uses a dedicated build instance.
 */
export interface Instance {
  /** Identifier of the instance, a bare UUID. */
  id: string;
  /** Identifier of the organisation the instance belongs to. Absent when the instance is not attached to an owner. */
  ownerId?: string;
  /** Identifier of the application the instance runs. */
  applicationId: string;
  /** Identifier of the deployment that created the instance. */
  deploymentId: string;
  /** Display name of the instance, as shown in the console. Absent until the instance is named. */
  name?: string;
  /** Name of the scaler flavor the instance runs on, which sets its CPU and RAM (`XS`, `S`, ...). Absent until the instance is assigned a flavor. */
  flavor?: string;
  /** Position of the instance within its deployment, starting at 0. Absent until the instance is assigned an index. */
  index?: number;
  /** Current lifecycle state of the instance. */
  state: InstanceState;
  /** Identifier of the hypervisor hosting the instance. */
  hypervisorId: string;
  /**
   * When the instance was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * When the instance was destroyed. Absent while the instance is still alive.
   * @renamedFrom `deletionDate`
   * @converted to an ISO date string
   */
  deletedAt?: string;
  /**
   * Where the instance can be reached. Absent until the instance has a network address assigned.
   * @converted from the backend socket-address wire form to `{ ip, port }`. The backend serialises it as an
   *   `"ip:port"` string (`"1.2.3.4:443"`, or `"[2001:db8::1]:443"` for IPv6); a legacy `{ ip, port }` object
   *   form is also accepted.
   */
  network?: {
    /** IP address of the instance. */
    ip: string;
    /** Port the application listens on. */
    port: number;
  };
  /** Whether this instance builds the application instead of running it. */
  isBuildVm: boolean;
}

/** Lifecycle state of an instance. */
export type InstanceState =
  | 'BOOTING'
  | 'READY'
  | 'STARTING'
  | 'DEPLOYING'
  | 'BUILDING'
  | 'STOPPING'
  | 'DELETED'
  | 'GHOST'
  | 'MIGRATION_IN_PROGRESS'
  | 'UP'
  | 'TASK_IN_PROGRESS';
