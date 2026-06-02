import type { Addon } from './addon.types.js';

export interface ListAddonCommandInput {
  ownerId: string;
}

export type ListAddonCommandOutput = Array<Addon>;
