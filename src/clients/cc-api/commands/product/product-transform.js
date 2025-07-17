/**
 * @import { ProductRuntime, ProductRuntimeFlavor } from './product.types.js';
 */

import { sortBy } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {ProductRuntime}
 */
export function transformProductRuntime(payload) {
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

/**
 * @param {any} payload
 * @returns {ProductRuntimeFlavor}
 */
export function transformProductRuntimeFlavor(payload) {
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
