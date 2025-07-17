import type { NetworkGroup } from './network-group.types.js';

export interface ListNetworkGroupCommandInput {
  ownerId: string;
}

export type ListNetworkGroupCommandOutput = Array<NetworkGroup>;
