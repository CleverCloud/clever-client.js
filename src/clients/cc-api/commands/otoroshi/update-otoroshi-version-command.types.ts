import type { OtoroshiInfo } from './otoroshi.types.js';

export interface UpdateOtoroshiVersionCommandInput {
  addonId: string;
  targetVersion: string;
}

export type UpdateOtoroshiVersionCommandOutput = OtoroshiInfo;
