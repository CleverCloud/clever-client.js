import { normalizeDate } from '../../../../lib/utils.js';
import type { Instance } from './instance.types.js';

export function transformApplicationInstance(payload: any): Instance {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    applicationId: payload.applicationId,
    deploymentId: payload.deploymentId,
    name: payload.name,
    flavor: payload.flavor,
    index: payload.index,
    state: payload.state,
    hypervisorId: payload.hypervisorId,
    creationDate: normalizeDate(payload.creationDate)!,
    deletionDate: normalizeDate(payload.deletionDate)!,
    network: payload.network,
    isBuildVm: payload.isBuildVm,
  };
}
