import type { PriceSystem } from './price-system.types.js';

export interface GetPriceSystemCommandInput {
  ownerId: string;
  zone: string;
}

export type GetPriceSystemCommandOutput = PriceSystem;
