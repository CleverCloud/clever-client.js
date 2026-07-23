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
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // transformed: sorted
  configKeys: Array<string>;
}
