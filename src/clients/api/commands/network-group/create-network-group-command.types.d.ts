import type { NetworkGroup } from './network-group.types.js';

export interface CreateNetworkGroupCommandInput {
  ownerId: string;
  label?: string;
  description?: string;
  tags?: Array<string>;
  members?: Array<{
    id: string;
    label?: string;
  }>;
}

export type CreateNetworkGroupCommandOutput = NetworkGroup;

export interface CreateNetworkGroupCommandInnerInput extends CreateNetworkGroupCommandInput {
  networkGroupId: string;
}
