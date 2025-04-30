import type { NetworkGroupMember } from './network-group.types.js';

export interface GetNetworkGroupMemberCommandInput {
  ownerId: string;
  networkGroupId: string;
  memberId: string;
}

export type GetNetworkGroupMemberCommandOutput = NetworkGroupMember;
