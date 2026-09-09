/**
 * Identifies the peer whose WireGuard configuration download URL is requested.
 */
export interface GetNetworkGroupWireguardConfigurationUrlCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the peer belongs to. */
  networkGroupId: string;
  /** Identifier of the peer to get the configuration URL of. */
  peerId: string;
}

/**
 * Where the WireGuard configuration of the peer can be downloaded from.
 */
export interface GetNetworkGroupWireguardConfigurationUrlCommandOutput {
  /** Presigned URL serving the WireGuard configuration, without requiring authentication. */
  url: string;
}
