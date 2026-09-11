import { sortBy } from '../../../../lib/utils.js';
import type {
  ElasticsearchServiceInfo,
  ProductAddonClusterVersion,
  ProductAddonVersions,
  ProductElasticsearchInfo,
  ProductRuntime,
  ProductRuntimeFlavor,
  ProductRuntimeVariant,
} from './product.types.js';

export function transformProductRuntime(payload: any): ProductRuntime {
  return {
    type: payload.type,
    version: payload.version,
    name: payload.name,
    variant: transformProductRuntimeVariant(payload.variant),
    description: payload.description,
    isEnabled: payload.enabled,
    isComingSoon: payload.comingSoon,
    maxInstances: payload.maxInstances,
    tags: payload.tags?.sort() ?? [],
    deployments: payload.deployments?.sort() ?? [],
    flavors: sortBy(payload.flavors.map(transformProductRuntimeFlavor), 'price'),
    defaultFlavor: transformProductRuntimeFlavor(payload.defaultFlavor),
    buildFlavor: transformProductRuntimeFlavor(payload.buildFlavor),
  };
}

export function transformProductRuntimeVariant(payload: any): ProductRuntimeVariant {
  return {
    id: payload.id,
    slug: payload.slug,
    name: payload.name,
    deployType: payload.deployType,
    logoUrl: payload.logo,
  };
}

export function transformProductRuntimeFlavor(payload: any): ProductRuntimeFlavor {
  return {
    name: payload.name,
    mem: payload.mem,
    cpus: payload.cpus,
    gpus: payload.gpus,
    disk: payload.disk,
    price: payload.price,
    isAvailable: payload.available,
    isSharedCpu: payload.microservice,
    isMachineLearning: payload.machine_learning,
    cpuPriorityOffset: payload.nice,
    priceId: payload.price_id?.toLowerCase(),
    memory: {
      unit: payload.memory.unit,
      value: payload.memory.value,
      formatted: payload.memory.formatted,
    },
    cpuFactor: payload.cpuFactor,
    memFactor: payload.memFactor,
    systemOverheadFactor: payload.systemOverheadFactor,
  };
}

export function transformProductAddonVersions(response: any): ProductAddonVersions {
  return {
    clusters: sortBy(response.clusters.map(transformAddonVersionCluster), 'label'),
    dedicated: Object.fromEntries(
      Object.entries(response.dedicated).map(([k, v]: [string, any]) => [
        k,
        { features: transformAddonVersionFeatures(v.features) },
      ]),
    ),
    defaultDedicatedVersion: response.defaultDedicatedVersion,
  };
}

function transformAddonVersionCluster(cluster: any): ProductAddonClusterVersion {
  return {
    id: cluster.id,
    label: cluster.label,
    zone: cluster.zone,
    version: cluster.version,
    features: transformAddonVersionFeatures(cluster.features),
  };
}

function transformAddonVersionFeatures(features: Array<any>): Array<{ name: string; isEnabled: boolean }> {
  return sortBy(
    features.map((feature: any) => ({ name: feature.name, isEnabled: feature.enabled })),
    'name',
  );
}

export function transformProductElasticsearchInfo(response: any): ProductElasticsearchInfo {
  return {
    services: {
      apm: transformServiceInfo(response.services.apm),
      kibana: transformServiceInfo(response.services.kibana),
    },
  };
}

function transformServiceInfo(payload: any): ElasticsearchServiceInfo {
  return {
    name: payload.name,
    mem: payload.mem,
    cpus: payload.cpus,
    gpus: payload.gpus,
    price: payload.price,
    isAvailable: payload.available,
    isSharedCpu: payload.microservice,
    cpuPriorityOffset: payload.nice,
    priceId: payload.price_id.toLowerCase(),
  };
}
