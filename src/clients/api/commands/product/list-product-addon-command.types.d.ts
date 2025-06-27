import type { ProductAddon } from './product.types.js';

export interface ListProductAddonCommandInput {
  withVersions: boolean;
}

export type ListProductAddonCommandOutput = Array<ProductAddon>;
