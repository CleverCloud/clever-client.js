import type { ProductAddon } from './product.types.js';

export interface ListProductAddonCommandInput {
  withVersions: boolean;
  ownerId?: string;
}

// transformed: sorted by name
export type ListProductAddonCommandOutput = Array<ProductAddon>;
