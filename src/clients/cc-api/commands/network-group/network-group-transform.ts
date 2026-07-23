import type { NetworkGroupEndpoint, NetworkGroupPeer } from './network-group.types.js';

/**
 * The API exposes the network group internals with abbreviations (`hv`, `ngIp`, `ngTerm`) that the
 * public types spell out.
 */
export function transformNetworkGroupPeer(payload: any): NetworkGroupPeer {
  const base = {
    id: payload.id,
    label: payload.label,
    publicKey: payload.publicKey,
    endpoint: transformNetworkGroupEndpoint(payload.endpoint),
    hostname: payload.hostname,
    parentMember: payload.parentMember,
    parentEvent: payload.parentEvent,
  };

  if (payload.type === 'CleverPeer') {
    return {
      ...base,
      type: 'CleverPeer',
      hypervisor: payload.hv,
    };
  }

  return { ...base, type: 'ExternalPeer' };
}

function transformNetworkGroupEndpoint(payload: any): NetworkGroupEndpoint {
  if (payload.type === 'ServerEndpoint') {
    return {
      type: 'ServerEndpoint',
      networkGroupTerm: payload.ngTerm,
      publicTerm: payload.publicTerm,
    };
  }

  return {
    type: 'ClientEndpoint',
    networkGroupIp: payload.ngIp,
  };
}
