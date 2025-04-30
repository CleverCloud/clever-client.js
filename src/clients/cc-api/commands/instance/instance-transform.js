/**
 * @import { Instance } from './instance.types.js'
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 *
 * @param {any} payload
 * @returns {Instance}
 */
export function transformApplicationInstance(payload) {
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
    creationDate: normalizeDate(payload.creationDate),
    deletionDate: normalizeDate(payload.creationDate),
    network: payload.network,
    isBuildVm: payload.isBuildVm,
  };
}
