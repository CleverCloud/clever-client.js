import type { ProductAddon } from './product.types.js';

export interface GetProductAddonCommandInput {
  id: string;
  withVersions: boolean;
  ownerId?: string;
}

export type GetProductAddonCommandOutput = ProductAddon;
