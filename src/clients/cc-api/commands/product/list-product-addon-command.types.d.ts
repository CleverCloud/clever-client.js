import type { ProductAddon } from './product.types.js';

export interface ListProductAddonCommandInput {
  withVersions: boolean;
  ownerId?: string;
}

export type ListProductAddonCommandOutput = Array<ProductAddon>;
