import type { OtoroshiInfo } from './otoroshi.types.js';

export interface GetOtoroshiInfoCommandInput {
  addonId: string;
}

export type GetOtoroshiInfoCommandOutput = OtoroshiInfo;
