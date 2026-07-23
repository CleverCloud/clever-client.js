/**
 * Identifies the member to remove from a network group.
 */
export interface DeleteNetworkGroupMemberCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the member belongs to. */
  networkGroupId: string;
  /** Identifier of the member to remove. */
  memberId: string;
}
