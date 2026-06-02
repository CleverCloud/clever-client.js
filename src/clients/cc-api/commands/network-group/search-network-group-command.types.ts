import type { NetworkGroupComponent, NetworkGroupComponentType } from './network-group.types.js';

export interface SearchNetworkGroupCommandInput {
  ownerId: string;
  query: string;
  types?: Array<NetworkGroupComponentType>;
}

export type SearchNetworkGroupCommandOutput = Array<NetworkGroupComponent>;
