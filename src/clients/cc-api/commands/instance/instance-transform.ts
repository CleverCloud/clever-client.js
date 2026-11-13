import { normalizeDate } from '../../../../lib/utils.ts';
import type { Instance } from './instance.types.ts';

export function transformApplicationInstance(payload: any): Instance {
  return {
    id: payload.id,
    ownerId: payload.ownerId ?? undefined,
    applicationId: payload.applicationId,
    deploymentId: payload.deploymentId,
    name: payload.name ?? undefined,
    flavor: payload.flavor ?? undefined,
    index: payload.index ?? undefined,
    state: payload.state,
    hypervisorId: payload.hypervisorId,
    createdAt: normalizeDate(payload.creationDate)!,
    deletedAt: normalizeDate(payload.deletionDate),
    isBuildVm: payload.isBuildVm,
  };
}
