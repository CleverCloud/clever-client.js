/**
 * Identifies the network group to delete.
 */
export interface DeleteNetworkGroupCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group to delete. */
  networkGroupId: string;
}
