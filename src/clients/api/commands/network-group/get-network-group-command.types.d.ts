import type { NetworkGroup } from './network-group.types.js';

export interface GetNetworkGroupCommandInput {
  ownerId: string;
  networkGroupId: string;
}

export type GetNetworkGroupCommandOutput = NetworkGroup;
