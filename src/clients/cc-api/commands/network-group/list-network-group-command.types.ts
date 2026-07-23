import type { NetworkGroup } from './network-group.types.js';

/**
 * Identifies the organisation whose network groups are listed.
 */
export interface ListNetworkGroupCommandInput {
  /** Identifier of the organisation owning the network groups. */
  ownerId: string;
}

/**
 * The network groups of the organisation, each with its members and peers.
 */
export type ListNetworkGroupCommandOutput = Array<NetworkGroup>;
