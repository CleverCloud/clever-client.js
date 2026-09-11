import { unknownToClient } from '../../../../lib/utils.js';
import type {
  NetworkGroup,
  NetworkGroupEndpoint,
  NetworkGroupMember,
  NetworkGroupPeer,
} from './network-group.types.js';

/**
 * A network group carries its members and its peers, and both need the same normalisation wherever
 * they come back: read on their own, listed, or matched by a search.
 */
export function transformNetworkGroup<T extends NetworkGroup>(payload: T): T {
  return {
    ...payload,
    members: payload.members.map(transformNetworkGroupMember),
    peers: payload.peers.map(transformNetworkGroupPeer),
  };
}

/**
 * The API answers the member kind in lower or mixed case, so it is uppercased to the four values the
 * published type declares.
 */
export function transformNetworkGroupMember<T extends { kind: string }>(
  payload: T,
): T & { kind: NetworkGroupMember['kind'] } {
  return {
    ...payload,
    kind: payload.kind.toUpperCase() as NetworkGroupMember['kind'],
  };
}

/**
 * The API exposes the network group internals with abbreviations (`hv`, `ngIp`, `ngTerm`) that the
 * public types spell out.
 */
export function transformNetworkGroupPeer(payload: any): NetworkGroupPeer {
  if (payload.type !== 'CleverPeer' && payload.type !== 'ExternalPeer') {
    return unknownToClient('type', payload);
  }

  const base = {
    id: payload.id,
    label: payload.label ?? undefined,
    publicKey: payload.publicKey,
    endpoint: transformNetworkGroupEndpoint(payload.endpoint),
    hostname: payload.hostname,
    parentMember: payload.parentMember,
    parentEvent: payload.parentEvent ?? undefined,
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

  if (payload.type === 'ClientEndpoint') {
    return {
      type: 'ClientEndpoint',
      networkGroupIp: payload.ngIp,
    };
  }

  return unknownToClient('type', payload);
}
