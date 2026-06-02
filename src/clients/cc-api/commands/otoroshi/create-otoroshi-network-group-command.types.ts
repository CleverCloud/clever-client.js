import type { OtoroshiInfo } from './otoroshi.types.js';

export interface CreateOtoroshiNetworkGroupCommandInput {
  addonId: string;
}

export type CreateOtoroshiNetworkGroupCommandOutput = OtoroshiInfo;
