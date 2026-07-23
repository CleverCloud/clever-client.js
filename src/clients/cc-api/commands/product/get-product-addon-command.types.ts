import type { ProductAddon } from './product.types.js';

/**
 * Identifies the add-on provider to retrieve, and how much of it to fetch.
 */
export interface GetProductAddonCommandInput {
  /** Identifier of the provider, for example `postgresql-addon`. */
  id: string;
  /** Whether to also fetch the versions the provider offers. Costs one extra request. */
  withVersions: boolean;
  /**
   * Identifier of an organisation, to get the catalogue as that organisation sees it.
   * @sentAs `orgaId`
   */
  ownerId?: string;
}

/**
 * The requested provider. Its `versions` are only filled when `withVersions` was set.
 */
export type GetProductAddonCommandOutput = ProductAddon;
