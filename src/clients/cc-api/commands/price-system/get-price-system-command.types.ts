import type { PriceSystem } from './price-system.types.js';

export interface GetPriceSystemCommandInput {
  // omit to get the public price system instead of an organisation's
  ownerId?: string;
  zone?: string;
  // only used for the public price system (defaults to EUR server-side); ignored when `ownerId` is set
  currency?: string;
}

export type GetPriceSystemCommandOutput = PriceSystem;
