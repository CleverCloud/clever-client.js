import type { NetworkGroupMember } from './network-group.types.js';

/**
 * Describes the member to add to a network group.
 */
export interface CreateNetworkGroupMemberCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group to add the member to. */
  networkGroupId: string;
  /**
   * Identifier of the member to add: an application id, an add-on real id, or an `external_<uuid>` id. Its prefix
   * determines the member kind and its domain name inside the network group.
   */
  memberId: string;
  /** Human readable name of the member. */
  label?: string;
}

/**
 * The member as it exists once the platform has added it to the network group.
 */
export type CreateNetworkGroupMemberCommandOutput = NetworkGroupMember;
