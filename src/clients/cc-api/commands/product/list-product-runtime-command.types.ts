import type { ProductRuntime } from './product.types.js';

export type ListProductRuntimeCommandInput = void | {
  ownerId?: string;
};

export type ListProductRuntimeCommandOutput = Array<ProductRuntime>;
