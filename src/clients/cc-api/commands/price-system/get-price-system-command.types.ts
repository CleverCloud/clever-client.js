import type { PriceSystem } from './price-system.types.js';

/**
 * Which price system to read: an organisation's, or the public one.
 */
export interface GetPriceSystemCommandInput {
  /** Identifier of the organisation. Omit it to get the public price system instead. */
  ownerId?: string;
  /**
   * Identifier of the zone to get the prices of. Omit it to cover every zone.
   * @sentAs `zone_id`
   */
  zone?: string;
  /**
   * Currency to express the prices in. Only used for the public price system, where it defaults to
   * `EUR` server-side; ignored when `ownerId` is set, since an organisation has its own currency.
   */
  currency?: string;
}

/**
 * The prices in force for the requested scope.
 */
export type GetPriceSystemCommandOutput = PriceSystem;
