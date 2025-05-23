import type { AddonProvider, AddonProviderPlan } from '../addon-provider/addon-provider.types.js';

export interface Addon {
  id: string;
  name: string;
  realId: string;
  region: string;
  zoneId: string;
  provider: AddonProvider;
  plan: AddonProviderPlan;
  // transformed from number to date iso string
  creationDate: string;
  configKeys: Array<string>;
}
