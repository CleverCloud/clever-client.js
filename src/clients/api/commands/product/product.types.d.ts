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
  disk: null;
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
