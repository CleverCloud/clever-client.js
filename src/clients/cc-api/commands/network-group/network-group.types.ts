/**
 * Any entity that can be returned by a network group search: the network group itself, one of its members, or one
 * of its peers. The `type` discriminator tells them apart.
 */
export type NetworkGroupComponent =
  | TypedComponent<'NetworkGroup', NetworkGroup>
  | TypedComponent<'Member', NetworkGroupMember>
  | NetworkGroupPeer;

/**
 * The discriminator values a network group component can take.
 */
export type NetworkGroupComponentType = 'NetworkGroup' | 'Member' | 'CleverPeer' | 'ExternalPeer';

/**
 * Adds the `type` discriminator to a network group entity, so that components returned side by side in a search
 * result can be told apart.
 */
export type TypedComponent<Type extends NetworkGroupComponentType, T> = T & {
  /** Names the kind of network group component this object is. */
  type: Type;
};

/**
 * A network group: a private WireGuard mesh network connecting applications, add-ons and external machines of the
 * same organisation, so that they can reach each other over a private IP range.
 */
export interface NetworkGroup {
  /** Public identifier of the network group, of the form `ng_<uuid>`. */
  id: string;
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Human readable name of the network group. */
  label: string;
  /** Free form description of the network group. */
  description?: string;
  /** Private IP range allocated to the network group, in CIDR notation. */
  networkIp: string;
  /** Last IP address handed out from the network group range; the next peer gets the one after it. */
  lastAllocatedIp: string;
  /** Tags attached to the network group. */
  tags: Array<string>;
  /** WireGuard peers currently attached to the network group, across all its members. */
  peers: Array<NetworkGroupPeer>;
  /** Members of the network group: the applications, add-ons and external machines it connects. */
  members: Array<NetworkGroupMember>;
  /** Revision of the network group, bumped every time it is modified. */
  version: number;
}

/**
 * A WireGuard peer of a network group: either a peer running on the Clever Cloud platform, or an external machine
 * joined to the network group by its owner.
 */
export type NetworkGroupPeer = NetworkGroupPeerClever | NetworkGroupPeerExternal;

/**
 * The properties shared by every network group peer, whatever its kind.
 */
interface NetworkGroupPeerBase {
  /** Identifier of the peer. */
  id: string;
  /** Human readable name of the peer. */
  label?: string;
  /** WireGuard public key of the peer, used by the other peers to encrypt the traffic sent to it. */
  publicKey: string;
  /** How the other peers reach this one: either a listening socket (server) or just a network group IP (client). */
  endpoint: NetworkGroupEndpoint;
  /** DNS name of the peer inside the network group. */
  hostname: string;
  /** Identifier of the member this peer belongs to. */
  parentMember: string;
  /** Identifier of the platform event that created this peer, when the platform created it. */
  parentEvent?: string;
}

/**
 * A peer running on the Clever Cloud platform: an application instance or an add-on node that the platform attached
 * to the network group on its own.
 */
export interface NetworkGroupPeerClever extends TypedComponent<'CleverPeer', NetworkGroupPeerBase> {
  /**
   * Identifier of the hypervisor hosting the peer.
   * @renamedFrom `hv`
   */
  hypervisor: string;
}

/**
 * A peer that is not hosted on the Clever Cloud platform: a machine joined to the network group with its own
 * WireGuard configuration.
 */
export type NetworkGroupPeerExternal = TypedComponent<'ExternalPeer', NetworkGroupPeerBase>;

/**
 * A member of a network group: the application, add-on or external machine that peers are attached to.
 */
export interface NetworkGroupMember {
  /** Identifier of the member: an application id, an add-on real id, or an `external_<uuid>` id. */
  id: string;
  /** Human readable name of the member. */
  label: string;
  /** DNS name resolving to the member inside the network group. */
  domainName: string;
  /** What the member is. Uppercased, because the API is not consistent about the case it returns. */
  kind: 'APPLICATION' | 'ADDON' | 'EXTERNAL';
}

/**
 * How a peer is reached over WireGuard: server peers listen on a socket, client peers only have an address inside
 * the network group.
 */
export type NetworkGroupEndpoint = NetworkGroupEndpointServer | NetworkGroupEndpointClient;

/**
 * The endpoint of a peer that accepts WireGuard connections.
 */
export interface NetworkGroupEndpointServer {
  /** Identifies a listening peer. */
  type: 'ServerEndpoint';
  /**
   * Address the peer listens on inside the network group range.
   * @renamedFrom `ngTerm`
   */
  networkGroupTerm: {
    /** IP address inside the network group range. */
    host: string;
    /** Port the peer listens on inside the network group. */
    port: number;
  };
  /** Publicly reachable address the other peers connect to, before the traffic enters the network group range. */
  publicTerm: {
    /** Public IP address of the peer. */
    host: string;
    /** Public port the peer is reachable on. */
    port: number;
  };
}

/**
 * The endpoint of a peer that only initiates WireGuard connections and is not reachable directly.
 */
export interface NetworkGroupEndpointClient {
  /** Identifies a non listening peer. */
  type: 'ClientEndpoint';
  /**
   * IP address allocated to the peer inside the network group range.
   * @renamedFrom `ngIp`
   */
  networkGroupIp: string;
}
