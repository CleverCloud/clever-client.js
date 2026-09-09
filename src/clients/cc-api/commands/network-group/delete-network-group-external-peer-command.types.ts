/**
 * Identifies the external peer to detach from a network group.
 */
export interface DeleteNetworkGroupExternalPeerCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the peer belongs to. */
  networkGroupId: string;
  /** Identifier of the external peer to detach. */
  externalPeerId: string;
}
