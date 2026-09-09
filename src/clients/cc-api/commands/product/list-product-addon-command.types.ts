import type { ProductAddon } from './product.types.js';

/**
 * How much of the add-on catalogue to fetch.
 */
export interface ListProductAddonCommandInput {
  /** Whether to also fetch the versions each provider offers. Costs one extra request per provider. */
  withVersions: boolean;
  /**
   * Identifier of an organisation, to get the catalogue as that organisation sees it.
   * @sentAs `orgaId`
   */
  ownerId?: string;
}

/**
 * The providers, sorted by name. Their `versions` are only filled when `withVersions` was set.
 */
export type ListProductAddonCommandOutput = Array<ProductAddon>;
