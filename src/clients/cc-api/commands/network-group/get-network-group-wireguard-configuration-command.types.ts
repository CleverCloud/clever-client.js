/**
 * Identifies the peer whose WireGuard configuration is requested.
 */
export interface GetNetworkGroupWireguardConfigurationCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group the peer belongs to. */
  networkGroupId: string;
  /** Identifier of the peer to get the configuration of. */
  peerId: string;
}

/**
 * The WireGuard configuration file of the peer, as plain text.
 */
export type GetNetworkGroupWireguardConfigurationCommandOutput = string;
