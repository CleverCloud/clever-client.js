import { normalizeDate } from '../../../../lib/utils.js';
import type { Instance } from './instance.types.js';

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
    network: transformNetwork(payload.network),
    isBuildVm: payload.isBuildVm,
  };
}

/**
 * Normalises the instance network address to `{ ip, port }`.
 *
 * The backend serialises it as an `"ip:port"` socket-address string (`"1.2.3.4:443"`, or `"[2001:db8::1]:443"`
 * for IPv6), but still accepts (and older backends may return) a legacy `{ ip, port }` object. This handles both.
 */
function transformNetwork(network: any): Instance['network'] {
  if (network == null) {
    return undefined;
  }

  if (typeof network === 'object') {
    return { ip: network.ip, port: network.port };
  }

  // "ip:port" string form: split on the last colon so IPv6 addresses (which contain colons) are preserved.
  const separatorIndex = network.lastIndexOf(':');
  const ip = network.slice(0, separatorIndex).replace(/^\[|\]$/g, '');
  const port = Number(network.slice(separatorIndex + 1));
  return { ip, port };
}
