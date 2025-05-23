import type { Addon } from './addon.types.js';

export interface CreateAddonCommandInput {
  ownerId: string;
  name: string;
  region: string;
  providerId: string;
  planId: string;
  options?: Record<string, string>;
}

export type CreateAddonCommandOutput = Addon;
