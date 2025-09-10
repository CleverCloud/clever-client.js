export interface GetNetworkGroupWireguardConfigurationCommandInput {
  ownerId: string;
  networkGroupId: string;
  peerId: string;
}

export interface GetNetworkGroupWireguardConfigurationCommandOutput {
  ngId: string;
  peerId: string;
  peers: [
    {
      peer_id: string;
      peer_ip: string;
      peer_hostname: string;
    },
  ];
  configuration: string;
  version: number;
}
