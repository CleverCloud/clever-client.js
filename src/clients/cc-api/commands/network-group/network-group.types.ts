export type NetworkGroupComponent =
  | TypedComponent<'NetworkGroup', NetworkGroup>
  | TypedComponent<'Member', NetworkGroupMember>
  | NetworkGroupPeer;

export type NetworkGroupComponentType = 'NetworkGroup' | 'Member' | 'CleverPeer' | 'ExternalPeer';

export type TypedComponent<Type extends NetworkGroupComponentType, T> = T & {
  type: Type;
};

export interface NetworkGroup {
  id: string;
  ownerId: string;
  label: string;
  description?: string;
  networkIp: string;
  lastAllocatedIp: string;
  tags: Array<string>;
  peers: Array<NetworkGroupPeer>;
  members: Array<NetworkGroupMember>;
  version: number;
}

export type NetworkGroupPeer = NetworkGroupPeerClever | NetworkGroupPeerExternal;

interface NetworkGroupPeerBase {
  id: string;
  label?: string;
  publicKey: string;
  endpoint: NetworkGroupEndpoint;
  hostname: string;
  parentMember: string;
  parentEvent?: string;
}

export interface NetworkGroupPeerClever extends TypedComponent<'CleverPeer', NetworkGroupPeerBase> {
  // renamed from hv
  hypervisor: string;
}

export type NetworkGroupPeerExternal = TypedComponent<'ExternalPeer', NetworkGroupPeerBase>;

export interface NetworkGroupMember {
  id: string;
  label: string;
  domainName: string;
  // transformed: uppercased
  kind: 'APPLICATION' | 'ADDON' | 'EXTERNAL';
}

export type NetworkGroupEndpoint = NetworkGroupEndpointServer | NetworkGroupEndpointClient;

export interface NetworkGroupEndpointServer {
  type: 'ServerEndpoint';
  // renamed from ngTerm
  networkGroupTerm: {
    host: string;
    port: number;
  };
  publicTerm: {
    host: string;
    port: number;
  };
}

export interface NetworkGroupEndpointClient {
  type: 'ClientEndpoint';
  // renamed from ngIp
  networkGroupIp: string;
}
