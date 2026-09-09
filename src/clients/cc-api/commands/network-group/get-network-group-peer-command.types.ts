import type { NetworkGroupPeer } from './network-group.types.js';

/**
 * Identifies the network group peer to retrieve.
 */
export interface GetNetworkGroupPeerCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the peer belongs to. */
  networkGroupId: string;
  /** Identifier of the peer to retrieve. */
  peerId: string;
}

/**
 * The requested peer, either a platform peer or an external one.
 */
export type GetNetworkGroupPeerCommandOutput = NetworkGroupPeer;
