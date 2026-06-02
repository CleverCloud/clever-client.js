import { sortBy } from '../../../../lib/utils.js';
import type {
  ElasticsearchServiceInfo,
  ProductAddonClusterVersion,
  ProductAddonVersions,
  ProductElasticsearchInfo,
  ProductRuntime,
  ProductRuntimeFlavor,
} from './product.types.js';

export function transformProductRuntime(payload: any): ProductRuntime {
  return {
    type: payload.type,
    version: payload.version,
    name: payload.name,
    variant: payload.variant,
    description: payload.description,
    enabled: payload.enabled,
    comingSoon: payload.comingSoon,
    maxInstances: payload.maxInstances,
    tags: payload.tags?.sort() ?? [],
    deployments: payload.deployments?.sort() ?? [],
    flavors: sortBy(payload.flavors.map(transformProductRuntimeFlavor), 'price'),
    defaultFlavor: transformProductRuntimeFlavor(payload.defaultFlavor),
    buildFlavor: transformProductRuntimeFlavor(payload.buildFlavor),
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
    available: payload.available,
    microservice: payload.microservice,
    machineLearning: payload.machine_learning,
    nice: payload.nice,
    priceId: payload.price_id.toLowerCase(),
    memory: {
      unit: payload.unit,
      value: payload.value,
      formatted: payload.formatted,
    },
    cpuFactor: payload.cpuFactor,
    memFactor: payload.memFactor,
  };
}

export function transformProductAddonVersions(response: any): ProductAddonVersions {
  return {
    clusters: sortBy(response.clusters.map(transformAddonVersionCluster), 'label'),
    dedicated: Object.fromEntries(
      Object.entries(response.dedicated).map(([k, v]: [string, any]) => [k, { features: sortBy(v.features, 'name') }]),
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
    features: sortBy(cluster.version, 'name'),
  };
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
    available: payload.available,
    microservice: payload.microservice,
    nice: payload.nice,
    priceId: payload.price_id.toLowerCase(),
  };
}
