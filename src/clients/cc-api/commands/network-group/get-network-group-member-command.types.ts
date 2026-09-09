import type { NetworkGroupMember } from './network-group.types.js';

/**
 * Identifies the network group member to retrieve.
 */
export interface GetNetworkGroupMemberCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the member belongs to. */
  networkGroupId: string;
  /** Identifier of the member to retrieve. */
  memberId: string;
}

/**
 * The requested network group member.
 */
export type GetNetworkGroupMemberCommandOutput = NetworkGroupMember;
