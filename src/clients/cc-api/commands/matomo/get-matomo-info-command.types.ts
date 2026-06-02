import type { MatomoInfo } from './matomo.types.js';

export interface GetMatomoInfoCommandInput {
  addonId: string;
}

export type GetMatomoInfoCommandOutput = MatomoInfo;
