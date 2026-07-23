import type { ProductRuntime } from './product.types.js';

export type ListProductRuntimeCommandInput = void | {
  ownerId?: string;
};

// transformed: sorted by name
export type ListProductRuntimeCommandOutput = Array<ProductRuntime>;
