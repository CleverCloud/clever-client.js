import type { NetworkGroupPeerExternal } from './network-group.types.js';

/**
 * Describes the external peer to attach to a network group member.
 *
 * The shape depends on the peer's role in the WireGuard mesh: a `SERVER` peer accepts connections and must declare
 * the public address it listens on, whereas a `CLIENT` peer only initiates connections and has no such address.
 */
export type CreateNetworkGroupExternalPeerCommandInput =
  | CreateNetworkGroupExternalClientPeerCommandInput
  | CreateNetworkGroupExternalServerPeerCommandInput;

/**
 * The fields shared by every external peer to attach, whatever its role.
 */
interface CreateNetworkGroupExternalPeerCommandInputBase {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group to attach the peer to. */
  networkGroupId: string;
  /** Human readable name of the peer. */
  label: string;
  /** WireGuard public key of the peer. */
  publicKey: string;
  /** DNS name to give to the peer inside the network group. */
  hostname?: string;
  /** Identifier of the platform event this peer creation belongs to. */
  parentEvent?: string;
  /** Identifier of the network group member the peer is attached to. */
  parentMember: string;
}

/**
 * An external peer that only initiates WireGuard connections: it has no public address the other peers connect to.
 */
export interface CreateNetworkGroupExternalClientPeerCommandInput extends CreateNetworkGroupExternalPeerCommandInputBase {
  /** Role of the peer in the WireGuard mesh: a client only initiates connections. */
  peerRole: 'CLIENT';
}

/**
 * An external peer that accepts WireGuard connections: it must declare the public address the other peers reach it at.
 */
export interface CreateNetworkGroupExternalServerPeerCommandInput extends CreateNetworkGroupExternalPeerCommandInputBase {
  /** Role of the peer in the WireGuard mesh: a server accepts connections. */
  peerRole: 'SERVER';
  /** Public IP address the peer accepts connections at. */
  ip: string;
  /** Public port the peer listens on. */
  port: number;
}

/**
 * The external peer as it exists once the platform has attached it to the network group.
 */
export type CreateNetworkGroupExternalPeerCommandOutput = NetworkGroupPeerExternal;

/**
 * What the creation endpoint answers, before the peer itself is readable.
 */
export interface CreateNetworkGroupExternalPeerCommandInnerOutput {
  /** Identifier allocated to the newly created peer. */
  peerId: string;
}
