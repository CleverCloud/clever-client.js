import type { ProductRuntime } from './product.types.js';

export interface GetProductRuntimeCommandInput {
  type: string;
  version: string;
  ownerId?: string;
}

export type GetProductRuntimeCommandOutput = ProductRuntime;
