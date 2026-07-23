import type { NetworkGroupComponent, NetworkGroupComponentType } from './network-group.types.js';

/**
 * Describes the network group search to run.
 */
export interface SearchNetworkGroupCommandInput {
  /** Identifier of the organisation to search in. */
  ownerId: string;
  /** Text matched against the id and the label of the network groups, members and peers. */
  query: string;
  /** Kinds of components to keep. When omitted or empty, every matching component is returned. */
  types?: Array<NetworkGroupComponentType>;
}

/**
 * The components matching the search: network groups, members and peers mixed together.
 */
export type SearchNetworkGroupCommandOutput = Array<NetworkGroupComponent>;
