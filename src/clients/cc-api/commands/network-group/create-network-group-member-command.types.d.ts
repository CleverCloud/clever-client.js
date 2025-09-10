import type { NetworkGroupMember } from './network-group.types.js';

export interface CreateNetworkGroupMemberCommandInput {
  ownerId: string;
  networkGroupId: string;
  memberId: string;
  label?: string;
}

export type CreateNetworkGroupMemberCommandOutput = NetworkGroupMember;
