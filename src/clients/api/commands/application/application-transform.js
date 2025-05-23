/**
 * @import { Application } from './application.types.js';
 */

import { normalizeDate, omit } from '../../../../lib/utils.js';
import { transformDomain } from '../domain/domain-transform.js';
import { transformProductRuntimeFlavor } from '../product/product-transform.js';

/**
 * @param {any} payload
 * @returns {Application}
 */
export function transformApplication(payload) {
  // @ts-ignore
  return {
    ...omit(payload, 'last_deploy', 'env', 'vhosts'),
    instance: {
      ...payload.instance,
      minFlavor: transformProductRuntimeFlavor(payload.instance.minFlavor),
      maxFlavor: transformProductRuntimeFlavor(payload.instance.maxFlavor),
      flavors: payload.instance.flavors.map(transformProductRuntimeFlavor),
    },
    creationDate: normalizeDate(payload.creationDate),
    lastDeploy: payload.last_deploy,
    forceHttps: payload.forceHttps === 'ENABLED',
    environment: payload.env,
    domains: payload.vhosts?.map(transformDomain),
  };
}
