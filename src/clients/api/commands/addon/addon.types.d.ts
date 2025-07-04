import type { AddonProviderFull, AddonProviderPlan } from '../addon-provider/addon-provider.types.js';

export interface Addon {
  id: string;
  name: string;
  realId: string;
  // renamed from region
  zone: string;
  zoneId: string;
  provider: AddonProviderFull;
  plan: AddonProviderPlan;
  // transformed from number to date iso string
  creationDate: string;
  configKeys: Array<string>;
}
