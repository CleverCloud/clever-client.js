import type { ProductAddon } from './product.types.js';

export interface GetProductAddonCommandInput {
  id: string;
  withVersions: boolean;
}

export type GetProductAddonCommandOutput = ProductAddon;
