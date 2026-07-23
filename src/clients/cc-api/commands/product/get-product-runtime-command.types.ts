import type { ProductRuntime } from './product.types.js';

/**
 * Identifies the runtime to retrieve.
 */
export interface GetProductRuntimeCommandInput {
  /** Identifier of the runtime, for example `node`. */
  type: string;
  /** Version of the runtime. */
  version: string;
  /**
   * Identifier of an organisation, to get the catalogue as that organisation sees it.
   * @sentAs `for`
   */
  ownerId?: string;
}

/**
 * The requested runtime.
 */
export type GetProductRuntimeCommandOutput = ProductRuntime;
