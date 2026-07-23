import type { AddonProviderFull } from '../addon-provider/addon-provider.types.js';

export interface ProductRuntime {
  type: string;
  version: string;
  name: string;
  variant: ProductRuntimeVariant;
  description: string;
  // renamed from enabled
  isEnabled: boolean;
  // renamed from comingSoon
  isComingSoon: boolean;
  maxInstances: number;
  // transformed: sorted
  tags: Array<string>;
  // transformed: sorted
  deployments: Array<string>;
  // transformed: sorted by price
  flavors: Array<ProductRuntimeFlavor>;
  defaultFlavor: ProductRuntimeFlavor;
  buildFlavor: ProductRuntimeFlavor;
}

export interface ProductRuntimeVariant {
  id: string;
  slug: string;
  name: string;
  deployType: string;
  logo: string;
}

export interface ProductRuntimeFlavor {
  name: string;
  mem: number;
  cpus: number;
  gpus: number;
  disk: number;
  price: number;
  // renamed from available
  isAvailable: boolean;
  // renamed from microservice
  isSharedCpu: boolean;
  // renamed from machine_learning
  isMachineLearning: boolean;
  // renamed from nice
  cpuPriorityOffset: number;
  // renamed from price_id
  // transformed: lowercased
  priceId: string;
  memory: {
    unit: string;
    value: number;
    formatted: string;
  };
  cpuFactor: number;
  memFactor: number;
}

export interface ProductAddon extends AddonProviderFull {
  versions?: ProductAddonVersions;
}

export interface ProductAddonVersions {
  // transformed: sorted by label
  clusters: Array<ProductAddonClusterVersion>;
  dedicated: Record<string, ProductAddonDedicatedVersion>;
  defaultDedicatedVersion: string;
}

export interface ProductAddonClusterVersion {
  id: string;
  label: string;
  zone: string;
  version: string;
  // transformed: each entry's enabled renamed to isEnabled, sorted by name
  features: Array<{
    name: string;
    isEnabled: boolean;
  }>;
}

export interface ProductAddonDedicatedVersion {
  // transformed: each entry's enabled renamed to isEnabled, sorted by name
  features: Array<{
    name: string;
    isEnabled: boolean;
  }>;
}

export interface ProductElasticsearchInfo {
  services: {
    apm: ElasticsearchServiceInfo;
    kibana: ElasticsearchServiceInfo;
  };
}

export interface ElasticsearchServiceInfo {
  name: string;
  mem: number;
  cpus: number;
  gpus: number;
  price: number;
  // renamed from available
  isAvailable: boolean;
  // renamed from microservice
  isSharedCpu: boolean;
  // renamed from nice
  cpuPriorityOffset: number;
  // renamed from price_id
  // transformed: lowercased
  priceId: string;
}
