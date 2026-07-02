import type { Addon } from './addon.types.js';

export interface CreateAddonCommandInput {
  ownerId: string;
  name: string;
  // renamed from region
  zone: string;
  providerId: string;
  planId: string;
  options?: Record<string, string>;
}

export type CreateAddonCommandOutput = Addon;
