import type { NetworkGroupPeerExternal } from './network-group.types.js';

/**
 * Describes the external peer to attach to a network group member.
 */
export interface CreateNetworkGroupExternalPeerCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group to attach the peer to. */
  networkGroupId: string;
  /** Human readable name of the peer. */
  label: string;
  /** Public IP address the peer can be reached at, for a peer that accepts connections. */
  ip?: string;
  /** Public port the peer listens on, for a peer that accepts connections. */
  port?: number;
  /** Role of the peer in the WireGuard mesh. Only peers that initiate connections can be declared this way. */
  peerRole: 'CLIENT';
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
