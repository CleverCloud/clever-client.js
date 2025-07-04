import type { ProductAddonVersions } from './product.types.js';

export interface GetProductAddonVersionsCommandInput {
  id: string;
}

export type GetProductAddonVersionsCommandOutput = ProductAddonVersions;
