import type { ApplicationId } from '../types/cc-api.types.js';

export interface GetInstanceCommandInput extends ApplicationId {
  instanceId: string;
}

export interface GetInstanceCommandOutput {
  id: string;
  ownerId: string;
  applicationId: string;
  deploymentId: string;
  name: string;
  flavor: string;
  index: number;
  state: string;
  hypervisorId: string;
  creationDate: string;
  deletionDate: string;
  network: {
    ip: string;
    port: number;
  };
  isBuildVm: true;
}
