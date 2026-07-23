export interface Instance {
  id: string;
  ownerId: string;
  applicationId: string;
  deploymentId: string;
  name: string;
  flavor: string;
  index: number;
  state: InstanceState;
  hypervisorId: string;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from deletionDate
  // transformed: converted to an ISO date string
  deletedAt?: string;
  network: {
    ip: string;
    port: number;
  };
  isBuildVm: boolean;
}

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
