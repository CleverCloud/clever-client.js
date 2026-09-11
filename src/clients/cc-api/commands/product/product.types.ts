import type { AddonProviderFull } from '../addon-provider/addon-provider.types.js';

/**
 * A runtime applications can be deployed on, as published in the product catalogue: what it is,
 * how it can be scaled, and what it costs.
 */
export interface ProductRuntime {
  /** Identifier of the runtime, for example `node`. */
  type: string;
  /** Version of the runtime. */
  version: string;
  /** Display name of the runtime. */
  name: string;
  /** Branding of the runtime, carrying its slug and logo. */
  variant: ProductRuntimeVariant;
  /** Free text description shown in the catalogue. */
  description: string;
  /**
   * Whether new applications may be created on this runtime.
   * @renamedFrom `enabled`
   */
  isEnabled: boolean;
  /**
   * Whether the runtime is announced but not usable yet.
   * @renamedFrom `comingSoon`
   */
  isComingSoon: boolean;
  /** Highest number of instances an application on this runtime may scale to. */
  maxInstances: number;
  /** Labels qualifying the runtime, used to filter the catalogue. Sorted. */
  tags: Array<string>;
  /** Protocols the code can be pushed with. Sorted. */
  deployments: Array<string>;
  /** Every scaler size available for this runtime, sorted by price. */
  flavors: Array<ProductRuntimeFlavor>;
  /** Scaler size a new application gets by default. */
  defaultFlavor: ProductRuntimeFlavor;
  /** Scaler size the build runs on by default. */
  buildFlavor: ProductRuntimeFlavor;
}

/**
 * The branding of a runtime: what the catalogue shows for it, independently of its version.
 */
export interface ProductRuntimeVariant {
  /** Identifier of the variant. */
  id: string;
  /** URL friendly name, the one an application can be created from. */
  slug: string;
  /** Display name of the variant. */
  name: string;
  /** Protocol the code is pushed with by default. */
  deployType: string;
  /**
   * URL of the variant logo.
   * @renamedFrom `logo`
   */
  logoUrl: string;
}

/**
 * A scaler size: how much CPU, memory and disk one instance gets, and what it costs.
 */
export interface ProductRuntimeFlavor {
  /** Name of the size, for example `nano` or `XL`. */
  name: string;
  /** Memory, in mebibytes. */
  mem: number;
  /** Number of CPUs. */
  cpus: number;
  /** Number of GPUs. */
  gpus: number;
  /** Disk space, in mebibytes. */
  disk: number;
  /** Price of one hour of runtime on this size. */
  price: number;
  /**
   * Whether this size can currently be provisioned.
   * @renamedFrom `available`
   */
  isAvailable: boolean;
  /**
   * Whether the CPUs are shared with other instances rather than dedicated.
   * @renamedFrom `microservice`
   */
  isSharedCpu: boolean;
  /**
   * Whether the size is meant for machine learning workloads.
   * @renamedFrom `machine_learning`
   */
  isMachineLearning: boolean;
  /**
   * Scheduler priority offset applied to the instance; `0` means a dedicated CPU.
   * @renamedFrom `nice`
   */
  cpuPriorityOffset: number;
  /**
   * Identifier of the matching price in the billing system, absent when the flavor has none recorded.
   * @renamedFrom `price_id`
   * @converted lowercased
   */
  priceId?: string;
  /** The memory, in a form ready to be displayed. */
  memory: {
    /** Unit the value is expressed in, for example `MB`. */
    unit: string;
    /** Amount of memory in that unit. */
    value: number;
    /** The amount and its unit, already formatted. */
    formatted: string;
  };
  /** Multiplier applied to the CPU share when the CPUs are shared. */
  cpuFactor: number;
  /** Multiplier applied to the memory share. */
  memFactor: number;
  /** Fraction of the flavor's resources reserved for the system rather than the application. */
  systemOverheadFactor: number;
}

/**
 * An add-on provider as published in the product catalogue, optionally with the versions its plans
 * can run.
 */
export interface ProductAddon extends AddonProviderFull {
  /** Versions the provider offers. Only filled when they were asked for. */
  versions?: ProductAddonVersions;
}

/**
 * The versions an add-on provider offers, split between the shared clusters and the dedicated
 * instances.
 */
export interface ProductAddonVersions {
  /** Shared clusters a plan can be provisioned on, sorted by label. */
  clusters: Array<ProductAddonClusterVersion>;
  /** Versions a dedicated instance can run, keyed by version. */
  dedicated: Record<string, ProductAddonDedicatedVersion>;
  /** Version a new dedicated instance gets when none is chosen. */
  defaultDedicatedVersion: string;
}

/**
 * One shared cluster an add-on can be provisioned on.
 */
export interface ProductAddonClusterVersion {
  /** Identifier of the cluster. */
  id: string;
  /** Display name of the cluster. */
  label: string;
  /** Name of the zone the cluster runs in. */
  zone: string;
  /** Version the cluster runs. */
  version: string;
  /**
   * Capabilities the cluster offers, sorted by name.
   * Each entry's `enabled` is renamed to `isEnabled`.
   */
  features: Array<{
    /** Name of the feature. */
    name: string;
    /** Whether the feature is available on this cluster. */
    isEnabled: boolean;
  }>;
}

/**
 * One version a dedicated add-on instance can run.
 */
export interface ProductAddonDedicatedVersion {
  /**
   * Capabilities this version offers, sorted by name.
   * Each entry's `enabled` is renamed to `isEnabled`.
   */
  features: Array<{
    /** Name of the feature. */
    name: string;
    /** Whether the feature is available on this version. */
    isEnabled: boolean;
  }>;
}

/**
 * The scaler sizes the services shipped alongside an Elasticsearch add-on run on.
 */
export interface ProductElasticsearchInfo {
  /** The optional services, keyed by service. */
  services: {
    /** Sizing of the APM server. */
    apm: ElasticsearchServiceInfo;
    /** Sizing of the Kibana instance. */
    kibana: ElasticsearchServiceInfo;
  };
}

/**
 * The scaler size one Elasticsearch companion service runs on, and what it costs.
 */
export interface ElasticsearchServiceInfo {
  /** Name of the size. */
  name: string;
  /** Memory, in mebibytes. */
  mem: number;
  /** Number of CPUs. */
  cpus: number;
  /** Number of GPUs. */
  gpus: number;
  /** Price of one hour of runtime on this size. */
  price: number;
  /**
   * Whether this size can currently be provisioned.
   * @renamedFrom `available`
   */
  isAvailable: boolean;
  /**
   * Whether the CPUs are shared with other instances rather than dedicated.
   * @renamedFrom `microservice`
   */
  isSharedCpu: boolean;
  /**
   * Scheduler priority offset applied to the instance; `0` means a dedicated CPU.
   * @renamedFrom `nice`
   */
  cpuPriorityOffset: number;
  /**
   * Identifier of the matching price in the billing system.
   * @renamedFrom `price_id`
   * @converted lowercased
   */
  priceId: string;
}
