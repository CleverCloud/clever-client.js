import type { ProductRuntime } from './product.types.js';

/**
 * Which catalogue to read: pass nothing for the public one, or an owner to get it as that
 * organisation sees it.
 */
export type ListProductRuntimeCommandInput = void | {
  /**
   * Identifier of the user or organisation.
   * @sentAs `for`
   */
  ownerId?: string;
};

/**
 * The runtimes, sorted by name.
 */
export type ListProductRuntimeCommandOutput = Array<ProductRuntime>;
