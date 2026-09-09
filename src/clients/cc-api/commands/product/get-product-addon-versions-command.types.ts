import type { ProductAddonVersions } from './product.types.js';

/**
 * Identifies the add-on provider whose versions are read.
 */
export interface GetProductAddonVersionsCommandInput {
  /** Identifier of the provider, for example `postgresql-addon`. */
  id: string;
}

/**
 * The versions the provider offers.
 */
export type GetProductAddonVersionsCommandOutput = ProductAddonVersions;
