import type { Addon } from './addon.types.js';

export interface ListAddonCommandInput {
  ownerId: string;
}

// transformed: sorted by name
export type ListAddonCommandOutput = Array<Addon>;
