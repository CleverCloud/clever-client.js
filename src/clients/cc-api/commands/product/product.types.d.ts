import type { AddonProviderFull } from '../addon-provider/addon-provider.types.js';

export interface ProductRuntime {
  type: string;
  version: string;
  name: string;
  variant: ProductRuntimeVariant;
  description: string;
  enabled: boolean;
  comingSoon: boolean;
  maxInstances: number;
  tags: Array<string>;
  deployments: Array<string>;
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
  available: boolean;
  microservice: boolean;
  // renamed from machine_learning
  machineLearning: boolean;
  nice: number;
  // renamed from price_id
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
  clusters: Array<ProductAddonClusterVersion>;
  dedicated: Record<string, ProductAddonDedicatedVersion>;
  defaultDedicatedVersion: string;
}

export interface ProductAddonClusterVersion {
  id: string;
  label: string;
  zone: string;
  version: string;
  features: Array<{
    name: string;
    enabled: boolean;
  }>;
}

export interface ProductAddonDedicatedVersion {
  features: Array<{
    name: string;
    enabled: boolean;
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
  available: boolean;
  microservice: boolean;
  nice: number;
  // renamed from price_id and transformed to lower case
  priceId: string;
}
