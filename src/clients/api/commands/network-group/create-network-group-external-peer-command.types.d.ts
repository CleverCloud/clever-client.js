import type { NetworkGroupPeerExternal } from './network-group.types.js';

export interface CreateNetworkGroupExternalPeerCommandInput {
  ownerId: string;
  networkGroupId: string;
  label: string;
  ip?: string;
  port?: number;
  peerRole: 'CLIENT';
  publicKey: string;
  hostname?: string;
  parentEvent?: string;
  parentMember: string;
}

export type CreateNetworkGroupExternalPeerCommandOutput = NetworkGroupPeerExternal;

export interface CreateNetworkGroupExternalPeerCommandInnerOutput {
  peerId: string;
}
