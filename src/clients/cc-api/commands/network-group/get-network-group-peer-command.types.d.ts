import type { NetworkGroupPeer } from './network-group.types.js';

export interface GetNetworkGroupPeerCommandInput {
  ownerId: string;
  networkGroupId: string;
  peerId: string;
}

export type GetNetworkGroupPeerCommandOutput = NetworkGroupPeer;
