/**
 * @import { ProductRuntime, ProductRuntimeFlavor } from './product.types.js';
 */

/**
 * @param {any} payload
 * @returns {ProductRuntime}
 */
export function transformProductRuntime(payload) {
  return {
    ...payload,
    flavors: payload.flavors.map(transformProductRuntimeFlavor),
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
    priceId: payload.price_id,
    memory: {
      unit: payload.unit,
      value: payload.value,
      formatted: payload.formatted,
    },
    cpuFactor: payload.cpuFactor,
    memFactor: payload.memFactor,
  };
}
