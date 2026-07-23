import type { NetworkGroup } from './network-group.types.js';

/**
 * Identifies the network group to retrieve.
 */
export interface GetNetworkGroupCommandInput {
  /** Identifier of the organisation owning the network group. */
  ownerId: string;
  /** Identifier of the network group to retrieve. */
  networkGroupId: string;
}

/**
 * The network group, with its members and its peers.
 */
export type GetNetworkGroupCommandOutput = NetworkGroup;
